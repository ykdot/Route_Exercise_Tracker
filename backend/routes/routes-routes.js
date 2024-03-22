const express = require('express');

const routeController = require('../controllers/routes-controller.js');

const router = express.Router();


router.get('/');

// authentication

router.get('/get-user-routes/:uid/:routeType', routeController.getRoutePoints);
router.delete('/delete-route/:rid', routeController.deleteRoute);


module.exports = router;