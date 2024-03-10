const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tj = require('@mapbox/togeojson');
const fs = require('fs');
const DOMParser = require('xmldom').DOMParser;

const User = require('../models/user.js');
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
    const error = new HttpError('User does not exist', 401);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, recognizedUser.password);
  } catch(err) {
    const error = new HttpError('Wrong Password', 401);
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
    token: token
  })
}

const createUser = async(req, res, next) => {

  // password length is not checked here but at the last try block which is wrong functionality
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs', 422));
  }

  const { email, username, password } = req.body;


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
    token: token
  });
}

const connectToPolarAPI = async(req, res, next) => {
  // code === authentication code from Polar
  const code = req.body.code;
  
  const api_auth = 'Basic ' + btoa(basic_auth);
  const api_data = new URLSearchParams({
    'grant_type': "authorization_code",
    'code': code,
    // 'redirect_uri': 'http://localhost:5173'
  }) ;

  let accessToken;
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
    accessToken = responseData.access_token
    // get / check the apiID to make sure the id connects with the user
  }catch(err) {
    throw new Error(err);
  }
  console.log(accessToken);
  try {
    let userAuthorization = 'Bearer ' + accessToken;
    const apiID = process.env.USER_API_ID;
    const data = await fetch(`https://www.polaraccesslink.com/v3/users/${apiID}`, 
    {
      method: 'GET',
      headers: {
        'Authorization': userAuthorization,
        'Accept': 'application/json'
      }
    }); 

    // proper user check needed later 
    const responseData = await data.json();
    console.log(responseData);  
  }catch(err) {
    throw new Error(err);
  } 
 
  res.status(201).json({ token: accessToken });
}

const getTestRoute = async(req, res, next) => {
  const gpx = new DOMParser().parseFromString(fs.readFileSync('./test.GPX', 'utf8'));
  const converted = tj.gpx(gpx);

  const coord = converted.features[0].geometry.coordinates;

  for (let i = 0; i < coord.length; i++) {
    coord[i].pop();
    [coord[i][0], coord[i][1]] = [coord[i][1], coord[i][0]];
  }
  
  res.status(200).json({coordinates: coord })
}

const getNewData = async(req, res, next) => {
  const token = req.params.token;
  // i might have to include sending the polar id, other user information later
  const api_auth = 'Basic ' + btoa(basic_auth);
  const userAuthorization = 'Bearer ' + token;
  

  // console.log(token);
  let transactionID;
  let list;
  try {
    // apiID should not be hard coded later
    const apiID = process.env.USER_API_ID;

    // get exercise transaction id to start working with data
    const data = await fetch(`https://www.polaraccesslink.com/v3/users/${apiID}/exercise-transactions`, 
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': userAuthorization
      }
    });

    // proper user check needed later 
    const responseData = await data.json();
    console.log(responseData); 

    transactionID = responseData["transaction-id"];

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
    throw new Error(err);
  } 
  const filteredList = await filterExercise(list, token);

  res.status(201).json({exercise: filteredList}); 
}

const filterExercise = async(exercises, token) => {
  let userAuthorization = 'Bearer ' + token;

  let list = [];
  for (let i = 0; i < exercises.length; i++) {
    try {
      const data2 = await fetch(exercises[i], 
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': userAuthorization
        },
        // body: {}
      });
  
      // proper user check needed later 
      const responseData2 = await data2.json();
      console.log(responseData2);
      if (responseData2["has-route"]) {
        list.push(responseData2);
      }
    }catch(err) {
      throw new Error(err);   
    }    
  }

  return list;
}



exports.login = login;
exports.createUser = createUser;
exports.connectToPolarAPI = connectToPolarAPI;
exports.getTestRoute = getTestRoute;

exports.getNewData = getNewData;