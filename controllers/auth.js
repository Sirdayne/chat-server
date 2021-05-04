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
        pool.query('INSERT INTO users(email, password, role) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING id', [request.body.email, hashPassword, role], (err, res) => {
            if (err) {
                response.sendStatus(401)
            }
            const user = res && res.rows[0] && res.rows[0] ? res.rows[0] : null
            if (user.id && user.email && res.rowCount === 1) {
                const token = generateAccessToken(user.id, user.email, user.role)
                response.json({ token, id: user.id, email: user.email, role: user.role })
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
                const token = generateAccessToken(user.id, user.email, user.role)
                response.json({ token, id: user.id, email: user.email, role: user.role })
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
                const { id, email, role } = user
                response.send({ id, email, role })
            } else {
                response.sendStatus(401)
            }
        })
    } else {
        response.sendStatus(401)
    }
}