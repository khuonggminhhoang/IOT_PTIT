const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

const connectMySql = async () => {
    try {
        await db.getConnection();
        console.log("Connect Successfully to MySql");
        db.releaseConnection();
    } catch (err) {
        console.error(err);
    }

};

module.exports = {
    db,
    connectMySql
};