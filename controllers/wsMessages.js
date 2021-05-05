const pool = require('../services/pool').pool;

exports.addMessage = ({user_id, message, event}, callback) => {
    pool.query('INSERT INTO messages(user_id, message, event) VALUES ($1, $2, $3) RETURNING *', [user_id, message, event], callback)
}

exports.addMessageAndReturnWithColor = ({user_id, message, event}, callback) => {
    pool.query(`WITH inserted_messages AS (
                    INSERT INTO messages (user_id, message, event) VALUES ($1, $2, $3) 
                        RETURNING *
                ) SELECT inserted_messages.id, event, message, user_id, email, users.color, created_at FROM inserted_messages 
                LEFT JOIN users ON inserted_messages.user_id = users.id`, [user_id, message, event], callback)
}

exports.getMessages = (callback) => {
    pool.query(`SELECT messages.id, event, message, user_id, email, users.color, created_at FROM messages 
                LEFT JOIN users ON users.id = messages.user_id ORDER BY id DESC`, callback)
}