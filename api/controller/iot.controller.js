const database = require('./../../config/database');
const moment = require('moment');

// [GET] /dashboard
module.exports.dashboardGET = async (req, res) => {
    let lastStoreStatus = null;
    _wss.once('connection', (ws) => {
        console.log('New WebSocket connection');

        // Tự động gửi dữ liệu mới liên tục (mỗi 5 giây)
        const interval = setInterval(async () => {
            const sql = 'SELECT * FROM store_status ORDER BY updated_at DESC LIMIT 1';
            const [rows] = await database.db.query(sql);
            if(rows[0] && (!lastStoreStatus || 
                lastStoreStatus.people_in !== rows[0].people_in ||
                lastStoreStatus.people_out !== rows[0].people_out)) {
                    rows[0]['updated_at'] = moment().format('HH:mm A');
                    ws.send(JSON.stringify(rows[0])); // Gửi dữ liệu mới đến client
                    lastStoreStatus = rows[0];
                }
        }, 100);

        ws.on('close', () => {
            console.log('WebSocket disconnected');
            clearInterval(interval); // Ngừng gửi dữ liệu khi client ngắt kết nối
        });
    });

    const sql = 'SELECT * FROM store_status ORDER BY updated_at DESC LIMIT 1';
    const [rows] = await database.db.query(sql);
    console.log(rows[0]);
    rows[0]['updated_at'] = moment().format('HH:mm A');

    return res.render("pages/dashboard.pug", {
        record_store_status: rows[0],
        pageTitle: "Dashboard"
    });
}

// [POST] /dashboard
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
    } catch (err) {
        return res.json({
            "statusCode": 400,
            "message": "Bad request"
        });
    }

}

// [POST] /dashboard/:state
module.exports.stateSystemPOST = async (req, res) => {
    const state = req.params.state;
    const sql = 'INSERT INTO state_system (state, timestamp) VALUES (?, ?)';
    await database.db.query(sql, [state, new Date(Date.now())]);
    
    return res.json({
        "success": true,
        "statusCode": 201,
        "message": "create successfully",
    });
}

// [GET] /dashboard/state-current
module.exports.stateCurrSystemGET = async (req, res) => {
    const sql = 'SELECT * FROM state_system ORDER BY timestamp DESC LIMIT 1';
    const [rows] = await database.db.query(sql);
    // console.log(rows[0].state);
    
    return res.json(rows[0].state);
}