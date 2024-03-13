const express = require('express');

const userController = require('../controllers/users-controller.js');

const router = express.Router();


router.get('/');

// authentication
router.post('/login', userController.login);
router.post('/create', userController.createUser);
router.post('/connect-api', userController.connectToPolarAPI);
router.get('/get-route', userController.getTestRoute);

router.post('/dummy-data/', userController.getNewData);
router.get('/get-route-type/:uid', userController.getUserRouteTypes);


module.exports = router;