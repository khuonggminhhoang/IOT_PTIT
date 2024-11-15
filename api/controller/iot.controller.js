const database = require('./../../config/database');
const moment = require('moment');

module.exports.dashboardGET = async (req, res) => {
    const sql = 'SELECT * FROM store_status ORDER BY updated_at DESC LIMIT 1';
    const [rows] = await database.db.query(sql);
    console.log(rows[0]);
    rows[0]['updated_at'] = moment().format('HH:mm a');

    return res.render("pages/dashboard.pug", {
        record_store_status: rows[0]
    });
}

module.exports.dashboardPOST = async (req, res) => {
    const sql = 'INSERT INTO visitor_log (timestamp, direction) VALUES (?, ?)';
    await database.db.query(sql, [new Date(Date.now()), req.body.state]);

    const people_inside = +req.body.people_inside;
    const people_in = +req.body.people_in;
    const people_out = people_in - people_inside;

    // console.log(people_inside + "====" + people_in);
    const sqlz = 'INSERT INTO store_status(people_inside, people_in, people_out) VALUES (?, ?, ?)';
    await database.db.query(sqlz, [people_inside, people_in, people_out]);

    try {
        return res.json({
            "success": true,
            "statusCode": 201,
            "message": "create successfully",
        });
    }
    catch(err) {
        return res.json({
            "statusCode": 400,
            "message": "Bad request"
        });
    }

}