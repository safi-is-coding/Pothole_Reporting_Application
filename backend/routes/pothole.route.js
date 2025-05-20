// const {Router} = require('express');
// const {sendPotholeRecordingAndLocation} = require('../controllers/pothole.controller.js');
// const upload = require('../middlewares/multer.middleware.js');

// // router.post('/', upload.single('video'), potholeController);
// const router = Router();

// router.route('/pothole').post(
//     upload.single('video'),
//     sendPotholeRecordingAndLocation
// )

// module.exports = router;

const { Router } = require('express');
const {     sendPotholeRecordingAndLocation
} = require('../controllers/pothole.controller.js');
const upload = require('../middlewares/multer.middleware.js');

const router = Router();

router.route('/pothole').post(
    upload.single('video'),
    sendPotholeRecordingAndLocation

);

module.exports = router;
