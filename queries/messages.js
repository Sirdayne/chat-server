import { pool } from 'services/pool'

const query = `CREATE TABLE messages 
(
    id SERIAL PRIMARY KEY,
    message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    event VARCHAR(255),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
)`;

pool.query(query, (err, res) => {
    console.log(err, res);
})