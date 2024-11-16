const express = require("express")
const router = express.Router()
// const controller = require("../controller/sensorlog.controller")

// router.get('/', controller.sensorlog);

router.get('/', (req, res) => {
  // Lấy các tham số lọc từ query string
  const {
    fromDate,
    toDate,
    fromHour,
    toHour,
    direction
  } = req.query;

  // Dữ liệu mẫu (hoặc lấy từ cơ sở dữ liệu)
  const visitor_logs = [{
      timestamp: "2024-11-01 08:30:00",
      direction: "in",
      quantity: 5,
      sensor_name: "Sensor 1"
    },
    {
      timestamp: "2024-11-01 09:00:00",
      direction: "out",
      quantity: 3,
      sensor_name: "Sensor 2"
    },
    {
      timestamp: "2024-11-01 09:15:00",
      direction: "in",
      quantity: 7,
      sensor_name: "Sensor 1"
    },
    {
      timestamp: "2024-11-01 10:00:00",
      direction: "out",
      quantity: 4,
      sensor_name: "Sensor 3"
    },
    {
      timestamp: "2024-11-01 10:30:00",
      direction: "in",
      quantity: 6,
      sensor_name: "Sensor 2"
    },
    {
      timestamp: "2024-11-01 11:00:00",
      direction: "out",
      quantity: 2,
      sensor_name: "Sensor 1"
    }
  ];

  // Lọc dữ liệu theo ngày, giờ và hướng
  let filtered_logs = visitor_logs;

  // Lọc theo ngày (fromDate, toDate)
  if (fromDate) {
    filtered_logs = filtered_logs.filter(log => log.timestamp >= fromDate);
  }
  if (toDate) {
    filtered_logs = filtered_logs.filter(log => log.timestamp <= toDate);
  }

  // Lọc theo giờ (fromHour, toHour)
  if (fromHour) {
    filtered_logs = filtered_logs.filter(log => log.timestamp.split(" ")[1] >= fromHour);
  }
  if (toHour) {
    filtered_logs = filtered_logs.filter(log => log.timestamp.split(" ")[1] <= toHour);
  }

  // Lọc theo hướng (direction)
  if (direction) {
    filtered_logs = filtered_logs.filter(log => log.direction === direction);
  }

  // Render trang với dữ liệu đã lọc
  res.render('pages/sensor-log', {
    visitor_logs: filtered_logs
  });
});

module.exports = router;