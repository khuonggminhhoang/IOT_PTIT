const database = require('./../../config/database');
const moment = require('moment');


module.exports.sensorlog = (req, res) => {
  return res.render("pages/sensor-log.pug")
}