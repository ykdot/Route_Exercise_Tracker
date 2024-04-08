const express = require('express');

const routeController = require('../controllers/routes-controller.js');

const router = express.Router();

// app.use('/api/routes', routesRoutes);
router.get('/');

// authentication

router.get('/get-user-routes/:uid/:routeType', routeController.getRoutePoints);
router.delete('/delete-route/:rid', routeController.deleteRoute);

router.get('/get-route/:rid', routeController.getRoute);

router.post('/manual-add-route', routeController.manualAddRoute);

module.exports = router;