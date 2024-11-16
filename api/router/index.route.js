const iotRoutes = require('./iot.route');
const sensorRoutes = require("./sensorlog.route")

module.exports = (app) => {
    app.use('/dashboard', iotRoutes);
    app.use('/sensor-log', sensorRoutes)

}