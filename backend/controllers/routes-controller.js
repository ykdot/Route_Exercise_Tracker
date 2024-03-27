const mongoose = require('mongoose');

const User = require('../models/user.js');
const Route = require('../models/route.js');
const HttpError = require('../models/http-error.js');



const getRoutePoints = async(req, res, next) => {
  const uid = req.params.uid;
  const routeType = req.params.routeType;

  let user;
  try {
    user = await User.findById(uid);
  }catch(err) {
    throw new HttpError('Server error', 500);
  }

  if (!user) {
    throw new HttpError('Server error', 401);
  }

  let routeList = [];

  const fetchedRoutes = user.routes.get(routeType);
  for (let i = 0; i < fetchedRoutes.length; i++) {
    try {
      let route = await Route.findById(fetchedRoutes[i]);
      routeList.push(route);
    }catch(err) {
      throw new HttpError("error", 404);
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
    throw new HttpError("Server error", 500);
  }

  res.json({route: route});
}

const deleteRoute = async(req, res, next) => {
  const uid = req.params.uid;
  const rid = req.params.rid;  

  console.log()
  let route;
  let user;
  try {
    route = await Route.findById(rid);
    user = await User.findById(route.user);
  }catch(err) {
    throw new HttpError('Server error', 500);
  }

  if (!route) {
    throw new HttpError('Route does not exist', 401);
  }

  // console.log(routeType);

  console.log(1);

  let temp = user.routes.get(route.type);
  console.log(temp);
  temp.pull(rid);


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