import { pool } from 'services/pool'

const query = `CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)`;

pool.query(query, (err, res) => {
    console.log(err, res);
})