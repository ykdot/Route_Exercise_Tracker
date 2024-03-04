const express = require('express');

const userController = require('../controllers/users-controller.js');

const router = express.Router();


router.get('/');

// authentication
router.post('/login', userController.login);
router.post('/create', userController.createUser);
router.get('/get-route', userController.getTestRoute);


module.exports = router;