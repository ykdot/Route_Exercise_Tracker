const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
  // default behavior 181
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    // extract data
    const token = req.headers.authorization.split(' ')[1]; // BEARER TOKEN\
    if (!token) {
      throw new Error('Authentication failed!');

    }    
    // token verification
    const decodedToken = jwt.verify(token, 'secret_string');
    req.userData = {userID: decodedToken.userID, username: decodedToken.username };
    next();
  }catch(err) {
    const error = new HttpError('Authentication failed', 401);
    return next(error);    
  }
}