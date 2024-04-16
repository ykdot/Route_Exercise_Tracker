const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const usersRoutes = require('./routes/users-routes');
const routesRoutes = require('./routes/routes-routes.js');
const HttpError = require('./models/http-error');

const app = express();
const url = process.env.MONGODB_API_KEY;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});


// middleware
app.use('/api/users', usersRoutes);
app.use('/api/routes', routesRoutes);

// cases when there is a request where there is no request before
app.use((req, res, next) => {
  const error = new HttpError('The searched route does not exist', 404);
  throw error; 
});
 
// any error thrown that is sent will come here, excluding the one above
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  // there is an error sent but res is unknown, so error is unknown but there is an error
  res.status(error.code || 500);
  res.json({message: error.message || 'unknown error'});
});

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected");
    app.listen(5000);
  })
  .catch(error => {
    console.log(error);
  });