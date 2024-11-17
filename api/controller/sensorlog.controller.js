const database = require('./../../config/database');
const moment = require('moment');

module.exports.sensorlog = async (req, res) => {

  const {
    fromDate,
    toDate,
    fromHour,
    toHour,
    direction
  } = req.query;

  try {
    // Lấy dữ liệu từ bảng `visitor_log`
    const [visitorRows] = await database.db.execute('SELECT * FROM visitor_log ORDER BY timestamp DESC');
    let visitor_logs = visitorRows;

    // Lọc dữ liệu theo ngày, giờ và hướng
    if (fromDate) {
      visitor_logs = visitor_logs.filter(log => log.timestamp >= fromDate);
    }
    if (toDate) {
      visitor_logs = visitor_logs.filter(log => log.timestamp <= toDate);
    }
    if (fromHour) {
      visitor_logs = visitor_logs.filter(log => log.timestamp.split(" ")[1] >= fromHour);
    }
    if (toHour) {
      visitor_logs = visitor_logs.filter(log => log.timestamp.split(" ")[1] <= toHour);
    }
    if (direction) {
      visitor_logs = visitor_logs.filter(log => log.direction === direction);
    }

    // Định dạng lại thời gian cho mỗi bản ghi của `visitor_logs`
    visitor_logs = visitor_logs.map(log => ({
      ...log,
      timestamp: moment(log.timestamp).format('YYYY-MM-DD HH:mm:ss')
    }));

    // Lấy dữ liệu từ bảng `state_system`
    const [statusRows] = await database.db.execute('SELECT * FROM state_system ORDER BY timestamp DESC');

    // Định dạng thời gian cho mỗi bản ghi của `state_system`
    const state_system = statusRows.map(status => ({
      ...status,
      timestamp: moment(status.timestamp).format('YYYY-MM-DD HH:mm:ss'),
      status: status.status === 'on' ? 'Bật' : 'Tắt' // Đổi trạng thái thành tiếng Việt
    }));

    // Render dữ liệu ra giao diện
    return res.render("pages/sensor-log.pug", {
      pageTitle: "SensorLog",
      visitor_logs: visitor_logs,
      state_system: state_system
    });

  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ cơ sở dữ liệu: ", error);
    return res.status(500).send("Lỗi server");
  }
};