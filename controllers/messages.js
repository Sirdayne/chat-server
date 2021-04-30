const pool = require('../services/pool').pool;

exports.addMessage = (request, response) => {
    pool.query('INSERT INTO messages(user_id, message) VALUES ($1, $2)', [request.body.user_id, request.body.message], (err, message) => {
        if (err) {
            response.sendStatus(500)
        }
        if (message.rowCount === 1) {
            response.sendStatus(201)
        } else {
            response.sendStatus(500)
        }
    })
}

exports.getMessages = (request, response) => {
    pool.query('SELECT * from messages', (err, res) => {
        if (err) {
            response.sendStatus(500)
        }
        response.send(res.rows)
    })
}