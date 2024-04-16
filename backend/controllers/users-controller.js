const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Helper = require('./helper.js');
const User = require('../models/user.js');
const Route = require('../models/route.js');
const HttpError = require('../models/http-error.js');
const basic_auth = process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET;

const login = async(req, res, next) => {
  const { username, password } = req.body;

  let recognizedUser;
  try {
    recognizedUser = await User.findOne({ username: username });
  } catch (err) {
    const error = new HttpError('Server Error', 500);
    return next(error);
  }


  if (!recognizedUser) {
    const error = new HttpError('Invalid username or password', 401);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, recognizedUser.password);
  } catch(err) {
    const error = new HttpError('Server Error', 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError('Invalid username or password', 401);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign({
      userID : recognizedUser.discriminator,
      username: recognizedUser.usename
    },
    'rt_real_string',
    { expiresIn: '1h'}
    );
  } catch(err) {
    const error = new HttpError('Could not log you in', 500);
    return next(error);    
  }

  res.json({
    userID: recognizedUser.id,
    username: recognizedUser.username,
    email: recognizedUser.email,
    polarAffiliated: recognizedUser.polarAffiliated,
    token: token
  })
}

const createUser = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs', 422));
  }

  const { email, username, password, rePassword } = req.body;


  let existingEmail;
  let existingUserName;
  try {
    existingEmail = await User.findOne({ email: email });
    existingUserName = await User.findOne({ username: username });

  } catch (err) {
    const error = new HttpError('Signup Error!', 500);
    return next(error);
  }

  if (existingEmail) {
    const error = new HttpError('This email is already associated with another user.', 422);
    return next(error);
  }

  if (existingUserName) {
    const error = new HttpError('This username is already in use.', 422);
    return next(error);
  }

  if (password.length < 7) {
    const error = new HttpError('Password length needs to be at least 7 characters', 422);
    return next(error);   
  }

  if (password !== rePassword) {
    const error = new HttpError('Password needs to match', 422);
    return next(error);       
  }

  // encrypt the password
  let hashedPassword;
  try {
    // 12 rounds strength
    hashedPassword = await bcrypt.hash(password, 12);
  }catch(err) {
    const error = new HttpError('Signup Error!', 500);
    return next(error);
  }

  const newUser = new User({
    email,
    username,
    password: hashedPassword    
  });

  try {
    await newUser.save();
  } catch (err) {
    // 'Could not make user!'
    const error = new HttpError(err, 500);
    return next(error);
  }


  // token creation
  let token;
  try {
    // info to bring to frontend
    token = jwt.sign({
      userID: newUser.id, 
      username: newUser.username,
      email: newUser.email}, 
      'rt_real_string',
      { expiresIn: '1h'}
      );
  }catch(err) {
    const error = new HttpError('Could not make user!', 500);
    return next(error);
  }

  res.status(201).json({  
    userID: newUser.id,
    username: newUser.username,
    email: newUser.email,
    polarAffiliated: newUser.polarAffiliated,
    token: token
  });
}

const connectToPolarAPI = async(req, res, next) => {
  // code === authentication code from Polar
  const code = req.body.code;
  const uid = req.body.uid;
  const redirect_uri = req.body.uri;
  console.log(redirect_uri);
  
  const api_auth = 'Basic ' + btoa(basic_auth);
  const api_data = new URLSearchParams({
    'grant_type': "authorization_code",
    'code': code,
    'redirect_uri': redirect_uri
  }) ;

  let accessToken;
  let apiID;
  try {
    const data = await fetch(`https://polarremote.com/v2/oauth2/token`, 
    {
      method: 'POST',
      headers: {
        'Authorization': api_auth,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json;charset=UTF-8'
      },
      body: api_data.toString()
    }); 

    // proper user check needed later 
    const responseData = await data.json();
    accessToken = responseData.access_token;
    console.log(accessToken);
    // get / check the apiID to make sure the id connects with the user
  }catch(err) {
    return next(new Error(err));
  }


  // check to see if account is affiliated with account
  // get user information
  try {
    let userAuthorization = 'Bearer ' + accessToken;

    let user;
    try {
      user = await User.findById(uid);
    }catch(err) {
      return next(new Error(err));
    }
    if (!user) {
      return next(new HttpError('User does not exist', 404));
    }
    console.log("user polar id is " + user.polarID);

    if (user.polarID === 0) {
      const data = await fetch(`https://www.polaraccesslink.com/v3/users`, 
      {
        method: 'POST',
        headers: {
          'Authorization': userAuthorization,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          "member-id": uid
        }) 
      }); 
      const responseData = await data.json();
      apiID = responseData['polar-user-id'];      
      try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        user.polarID = apiID;
        user.polarAffiliated = true;
        await user.save({ session: sess });
        await sess.commitTransaction();
      }catch(err) {
        return next(new HttpError(err, 500));
      }
    }
    else {
      apiID = user.polarID;
    }
  }catch(err) {
    return next(new Error(err));
  } 
 
  res.status(201).json({ apiID: apiID, token: accessToken });
}

const getNewData = async(req, res, next) => {
  const token = req.body.token;
  const uid = req.body.uid;


  // const api_auth = 'Basic ' + btoa(basic_auth);
  const userAuthorization = 'Bearer ' + token;
  let user;
  try {
    user = await User.findById(uid);
  }catch(err) {
    return next(new HttpError('Server Error', 500));
  }

  if (!user) {
    return next(new HttpError("User does not exist", 404));
  }
  const apiID = user.polarID;

  let transactionID;
  let list;
  try {
    // get exercise transaction id to start working with data
    const data = await fetch(`https://www.polaraccesslink.com/v3/users/${apiID}/exercise-transactions`, 
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': userAuthorization
      }
    });

    // transaction shelf life is 10 minutes; potentially no other transaction being able to be created in that timeframe
    const responseData = await data.json();
    transactionID = responseData["transaction-id"];
    // console.log(responseData); 

    // provides the list of exercises that is included in the transaction 
    const data2 = await fetch(`https://www.polaraccesslink.com/v3/users/${apiID}/exercise-transactions/${transactionID}`, 
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': userAuthorization
      },
    });

    // proper user check needed later 
    const responseData2 = await data2.json();
    console.log(responseData2.exercises); 
    list = responseData2.exercises;  
  }catch(err) {
    return next(err);
  } 
  const status = await Helper.filterExercise(uid, list, token);
  if (status.code !== 201) {
    throw status;
  }

  res.status(201); 
}

const getUserRoutes = async(req, res, next) => {
  const userID = req.params.uid;

  let user;
  try {
    user = await User.findById(userID);
  }catch(err) {
    return next(new HttpError('Server error', 500));
  }

  if (!user) {
    return next(new HttpError('Server error', 401));
  }

  let routeTypeList = [];
  const iterator = user.routes.keys();

  let type = iterator.next().value;
  while (type !== undefined) {
    routeTypeList.push(type);
    type = iterator.next().value;
  }
  res.status(200).json({ types: routeTypeList, list: user.routes });
}

const getAllUserRoutes = async(req, res, next) => {
  const userID = req.params.uid;

  let user;
  try {
    user = await User.findById(userID);
  }catch(err) {
    return next(new HttpError('Server error', 500));
  }

  if (!user) {
    return next(new HttpError('Server error', 401));
  }

  let keys = [];
  const iterator = user.routes.keys();

  let type = iterator.next().value;
  while (type !== undefined) {
    keys.push(type);
    type = iterator.next().value;
  }

  res.status(200).json({ keys: keys, values: user.routes });
}

const getUserGeneralInfo = async(req, res, next) => {
  const userID = req.params.uid;

  let user;
  try {
    user = await User.findById(userID);
  }catch(err) {
    return next(new HttpError('Server error', 500));
  }

  if (!user) {
    return next(new HttpError('Server error', 401));
  }

  const userInfo = [];
  const iterator = user.routes.keys();

  let type = iterator.next().value;
  while (type !== undefined) {
    let distance = 0, longestDistance = 0, longestRoute = '';

    try {
      
      for (let i = 0; i < user.routes.get(type).length; i++) {
        let route = await Route.findById(user.routes.get(type)[i]);
        distance += route.distance;
        if (route.distance > longestDistance) {
          longestDistance = route.distance;
          longestRoute = {
            id: user.routes.get(type)[i],
            date: route.date,
            distance: route.distance
          };
        }
      }
      let typeInfo = {
        key: type,
        routes: user.routes.get(type).length,
        distance: distance,
        longest: longestRoute
      };
      
      userInfo.push(typeInfo);
    }catch(err) {
      return next(new HttpError(err, 401));
    }
    type = iterator.next().value;
  }
  res.status(200).json({ info: userInfo });
}

const deleteAccount = async(req, res, next) => {
  const uid = req.params.uid;
  const apiID = req.params.apiID;
  const userAuthorization = 'Bearer ' + req.params.token;

  let user;
  let routes;
  try {
    user = await User.findById(uid);
    routes = await Route.find({user: uid});

  }catch(err) {
    return next(new HttpError('Server error', 500));
  }

  if (!user) {
    return next(new HttpError('user does not exist', 401));
  }

  if (user.polarID !== 0) {
    // delink polar account
    try {
      const response = async() => 
      await fetch(`https://www.polaraccesslink.com/v3/users/${apiID}`, {
        method: 'DELETE',
        headers: {
          'Authorization': userAuthorization
        },
      });
      await response();

    }catch(err) {
      return next(new HttpError(err, 500));
    }    
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    // delete routes from routes
    const len = routes.length;

    for (let i = 0; i < len; i++) {
      await routes[i].deleteOne({session:sess});
    }

    await user.deleteOne({ session: sess});
    await sess.commitTransaction();
  }catch(err) {
    return next(new HttpError(err, 500));   
  }

  res.status(202).json({ message: "Successfully deleted account" });
}

exports.login = login;
exports.createUser = createUser;
exports.connectToPolarAPI = connectToPolarAPI;
exports.getNewData = getNewData;
exports.getUserRoutes = getUserRoutes;
exports.getAllUserRoutes = getAllUserRoutes;
exports.getUserGeneralInfo = getUserGeneralInfo;
exports.deleteAccount = deleteAccount;