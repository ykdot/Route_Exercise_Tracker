const express = require('express');
const userController = require('../controllers/users-controller.js');
const router = express.Router();

router.get('/');

// authentication
router.post('/login', userController.login);
router.post('/create', userController.createUser);
router.post('/connect-api', userController.connectToPolarAPI);
router.post('/get-new-data', userController.getNewData);
router.get('/get-user-routes/:uid', userController.getUserRoutes);
router.get('/get-all-user-routes/:uid', userController.getAllUserRoutes);
router.get('/get-general-user-info/:uid', userController.getUserGeneralInfo);
router.delete('/delete-account/:uid/:apiID/:token', userController.deleteAccount);

module.exports = router;