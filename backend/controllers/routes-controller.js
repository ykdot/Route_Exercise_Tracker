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


exports.getRoutePoints = getRoutePoints;