const mongoose = require('mongoose');
const DOMParser = require('xmldom').DOMParser;
const tj = require('@mapbox/togeojson');
const fs = require('fs');
const User = require('../models/user.js');
const Route = require('../models/route.js');
const HttpError = require('../models/http-error.js');


const getRoute = async(file) => {
  const gpx = new DOMParser().parseFromString(fs.readFileSync(file, 'utf8'));
  const converted = tj.gpx(gpx);

  const coord = converted.features[0].geometry.coordinates;

  for (let i = 0; i < coord.length; i++) {
    coord[i].pop();
    [coord[i][0], coord[i][1]] = [coord[i][1], coord[i][0]];
  }
  
  return coord;
}

const filterExercise = async(uid, exercises, token) => {
  let userAuthorization = 'Bearer ' + token;

  let status;
  for (let i = 0; i < exercises.length; i++) {
    try {
      const data2 = await fetch(exercises[i], 
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': userAuthorization
        },
      });
  
      // proper user check needed later 
      const responseData = await data2.json();
      if (responseData["has-route"]) {
        const coord = await getPoints(exercises[i], token);
        responseData['coord'] = coord;
        status = await createRoute(uid, responseData, coord);

        if (status.code !== 201) {
          return status;
        }
      }
    }catch(err) {
      throw new Error(err);   
    }    
  }

  return status;
}

const getPoints = async(exerciseURL, token) => {
  let userAuthorization = 'Bearer ' + token;
  let coord;

  try {
    const url = exerciseURL + '/gpx';
    const data2 = await fetch(url, 
    {
      method: 'GET',
      headers: {
        'Accept': 'application/gpx+xml',
        'Authorization': userAuthorization
      },
    });

    // proper user check needed later 
    // const responseData2 = await data2.text();
    const gpxFile = "./newPoints.gpx"
    const fileContent = await data2.text();
    fs.writeFileSync(gpxFile, fileContent);
    coord = await getRoute(gpxFile);
    fs.unlink(gpxFile, (err) => {
      if (err) {
        console.error(err);
      }
    });    
  }catch(err) {
    throw new Error(err);   
  }    
  
  return coord; 
}

const createRoute = async(uid, route, coord) => {
  
  // check if user exists
  let user;
  try {
    user = await User.findById(uid);
  } catch(err) {
    throw new HttpError('request error', 404);   
  }

  if (!user) {
    throw new HttpError('could not find user', 500);   
  }

  // create new route
  const createdRoute = new Route({
    user: user,
    method: "POLAR",
    type: route['detailed-sport-info'],
    distance: route['distance'],
    date: route['start-time'],
    duration: route['duration'],
    calories: route['calories'],
    points: coord,
    heartRate: route['heart-rate'],
    // temp
    other: route
  });

  // add new key if it doesn't exist in maps
  if (user.routes.get(route['detailed-sport-info']) === undefined) {
    user.routes.set(route['detailed-sport-info'], []);
  }

  try {
    // transaction and sessions
    // makes sure everything is good before putting both in the database
    // manually create collection for posts
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await createdRoute.save( { session: sess });

    user.routes.get(route['detailed-sport-info']).push(createdRoute._id);
    await user.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      err, 500
      //"Creation of route type Failed", 500
    );
    throw error;
  }

  // temporary languuge for now
  return new HttpError('Success', 201);
}

exports.getRoute = getRoute;
exports.filterExercise = filterExercise;