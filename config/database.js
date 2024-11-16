const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'iot'
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