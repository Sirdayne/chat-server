const pool = require('../services/pool').pool;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateAccessToken = (id, email, role) => {
    const payload = { id, email, role };
    return jwt.sign(payload, process.env.SECRET_JWT, { expiresIn: '24h'})
}

exports.register = (request, response) => {
    const salt = 7;
    const hashPassword = bcrypt.hashSync(request.body.password, salt)
    const role = 'user'
    try {
        pool.query('INSERT INTO users(email, password, role, color) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING RETURNING *', [request.body.email, hashPassword, role, request.body.color], (err, res) => {
            if (err) {
                response.sendStatus(401)
            }
            const user = res?.rows[0];
            if (user && user.id && user.email && res.rowCount === 1) {
                const { id, email, role, color } = user
                const token = generateAccessToken(user.id, email, role)
                response.json({ token, id, email, role, color })
            } else {
                response.sendStatus(401)
            }
        })
    } catch(e) {
        response.sendStatus(401)
    }
}

exports.login = (request, response) => {
    pool.query('SELECT * from users WHERE email = $1', [request.body.email], (err, res) => {
        const user = res.rowCount === 1 ? res.rows[0] : null;
        if (err || !request.body.password) {
            response.sendStatus(401)
        }
        if (user && user.id && user.email) {
            const validPassword = bcrypt.compareSync(request.body.password, user.password);
            if (validPassword) {
                const { id, email, role, color } = user
                const token = generateAccessToken(user.id, user.email, user.role)
                response.json({ token, id, email, role, color })
            } else {
                response.sendStatus(401)
            }
        } else {
            response.sendStatus(401)
        }
    })
}

exports.getCurrentUser = (request, response) => {
    if (request.user && request.user.id) {
        pool.query('SELECT * from users WHERE id = $1', [request.user.id], (err, res) => {
            if (err) {
                response.sendStatus(401)
            }
            if (res && res.rows && res.rows.length === 1) {
                const user = res?.rows[0]
                const { id, email, role, color } = user
                response.send({ id, email, role, color })
            } else {
                response.sendStatus(401)
            }
        })
    } else {
        response.sendStatus(401)
    }
}