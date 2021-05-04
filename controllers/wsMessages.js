const pool = require('../services/pool').pool;

exports.addMessage = ({user_id, message, event}, callback) => {
    pool.query('INSERT INTO messages(user_id, message, event) VALUES ($1, $2, $3) RETURNING *', [user_id, message, event], callback)
}

exports.getMessages = (callback) => {
    pool.query(`SELECT messages.id, event, message, user_id, email, created_at FROM messages 
                LEFT JOIN users ON users.id = messages.user_id ORDER BY id DESC`, callback)
}