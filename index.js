const express = require('express');
const cors = require('cors');
require('dotenv').config();
const database = require('./config/database');

const app = express();
const port = process.env.PORT;
// Cấu hình CORS
app.use(cors());

app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static("public"));

// connect to DB
database.connectMySql();

// app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const iotApi = require('./api/router/index.route');
iotApi(app);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});