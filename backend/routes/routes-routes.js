const express = require('express');
const multer = require('multer');

// file system to keep track of files that are sent from the frontend
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  }
})

const upload = multer({ storage: storage })

const routeController = require('../controllers/routes-controller.js');

const router = express.Router();

// app.use('/api/routes', routesRoutes);
router.get('/');

// authentication

router.get('/get-user-routes/:uid/:routeType', routeController.getRoutePoints);
router.delete('/delete-route/:rid', routeController.deleteRoute);

router.get('/get-route/:rid', routeController.getRoute);

router.post('/manual-add-route', upload.single('file'), routeController.manualAddRoute);

module.exports = router;