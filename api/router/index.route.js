const iotRoutes = require('./iot.route');

module.exports = (app) => {
    app.use('/dashboard', iotRoutes);

}