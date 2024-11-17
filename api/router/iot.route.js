const express = require('express');
const router = express.Router();
const controller = require('./../controller/iot.controller');

router.get('/', controller.dashboardGET);

router.post('/', controller.dashboardPOST)

router.post('/:state', controller.stateSystemPOST);

router.get('/state-current', controller.stateCurrSystemGET);

router.get('/chart', controller.getChart);

module.exports = router;