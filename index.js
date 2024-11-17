const express = require('express');
const cors = require('cors');
require('dotenv').config();
const database = require('./config/database');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT;

// Tạo HTTP server
const server = http.createServer(app);

// Tạo WebSocket server
const wss = new WebSocket.Server({ server });

// Cấu hình CORS
app.use(cors());

app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static("public"));

// connect to DB
database.connectMySql();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const iotApi = require('./api/router/index.route');
iotApi(app);

// Xử lý WebSocket
global._wss = wss;

// Start server
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
