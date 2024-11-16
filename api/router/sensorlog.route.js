const express = require("express")
const router = express.Router()
const controller = require("../controller/sensorlog.controller")

router.get('/', controller.sensorlog);
module.exports = router;