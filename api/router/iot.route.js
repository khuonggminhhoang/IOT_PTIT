const express = require('express');
const router = express.Router();
const controller = require('./../controller/iot.controller');

router.get('/', controller.dashboardGET);

router.post('/', controller.dashboardPOST)

module.exports = router;