const express = require('express');

const userController = require('../controllers/users-controller.js');

const router = express.Router();


router.get('/');

// authentication
router.post('/login', userController.login);
router.post('/create', userController.createUser);
router.post('/connect-api', userController.connectToPolarAPI);

router.post('/dummy-data/', userController.getNewData);
router.get('/get-user-routes/:uid', userController.getUserRoutes);


module.exports = router;