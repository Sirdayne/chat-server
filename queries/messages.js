import { pool } from 'services/pool'

const query = `CREATE TABLE messages 
(
    id SERIAL PRIMARY KEY,
    text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
)`;

pool.query(query, (err, res) => {
    console.log(err, res);
})