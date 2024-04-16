const mongoose = require('mongoose');
const fs = require('fs');
const User = require('../models/user.js');
const Route = require('../models/route.js');
const HttpError = require('../models/http-error.js');
const Helper = require('./helper.js');


const getRoutePoints = async(req, res, next) => {
  const uid = req.params.uid;
  const routeType = req.params.routeType;

  let user;
  try {
    user = await User.findById(uid);
  }catch(err) {
    return next(new HttpError('Server error', 500));
  }

  if (!user) {
    return next(new HttpError('Server error', 401));
  }

  let routeList = [];

  const fetchedRoutes = user.routes.get(routeType);
  for (let i = 0; i < fetchedRoutes.length; i++) {
    try {
      let route = await Route.findById(fetchedRoutes[i]);
      routeList.push(route);
    }catch(err) {
      return next(new HttpError("error", 404));
    }
  }
  res.status(200).json({ list: routeList });
}

const getRoute = async(req, res) => {
  const rid = req.params.rid;
  let route;

  try {
    route = await Route.findById(rid);
  }catch(err) {
    return next(new HttpError("Server error", 500));
  }

  res.json({route: route});
}

const manualAddRoute = async(req, res, next) => {
  const {uid, type, distance, time, duration, calories} = req.body;
  const file = req.file;

  let existingUser;
  try {
    existingUser = await User.findById(uid);
  }catch(err) {
    return next(new HttpError("Server Error", 500));
  }

  // throw an error if userID does not point to any user
  if (!existingUser) {
    return next(new HttpError("User doesn't exist", 404));
  }

  if (type.length < 3) {
    return next(new HttpError("Type length is too short", 404));
  }
  let updatedType = type.toUpperCase();

  const fileType = file.originalname.split('.').pop();

  if (fileType !== 'GPX') {
    return next(new HttpError("Wrong file type", 404));
  }

  const coord = await Helper.getRoute(file.path);
  
  const createdRoute = new Route({
    user: uid,
    method: "MANUAL",
    type: updatedType,
    distance: distance,
    date: time,
    duration: duration,
    calories: calories,
    points: coord,
  });

  if (existingUser.routes.get(updatedType) === undefined) {
    existingUser.routes.set(updatedType, []);
  }

  try {
    // transaction and sessions
    // makes sure everything is good before putting both in the database
    // manually create collection for posts
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await createdRoute.save( { session: sess });

    existingUser.routes.get(updatedType).push(createdRoute._id);
    await existingUser.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      err, 500
    );
    return error;
  }

  fs.unlink(file.path, (err) => {
    if (err) {
      console.error(err);
    }
  });    
  res.status(201).json({ newRoute: createdRoute }); 
}

const deleteRoute = async(req, res, next) => {
  const rid = req.params.rid;  
  let route;
  let user;
  try {
    route = await Route.findById(rid);
    user = await User.findById(route.user);
  }catch(err) {
    return next(new HttpError('Server error', 500));
  }

  if (!route) {
    return next(new HttpError('Route does not exist', 401));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await route.deleteOne({ session: sess});
    if (temp.length !== 0) {
      user.routes.set(route.type, temp);
    }else {
      user.routes.delete(route.type);
    }

    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch(err) {
    const error = new HttpError(err, 500);
    return next(error);
  }  

  res.status(202).json({ message: "successful delete"});  
}


exports.getRoutePoints = getRoutePoints;
exports.deleteRoute = deleteRoute;
exports.getRoute = getRoute;
exports.manualAddRoute = manualAddRoute;