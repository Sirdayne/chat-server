const pool = require('../services/pool').pool;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateAccessToken = (id, email) => {
    const payload = { id, email };
    return jwt.sign(payload, process.env.SECRET_JWT, { expiresIn: '24h'})
}

exports.register = (req, res) => {
    const salt = 7;
    const hashPassword = bcrypt.hashSync(req.body.password, salt)
    const role = 'user'
    pool.query('INSERT INTO users(email, password, role) VALUES ($1, $2, $3)', [req.body.email, hashPassword, role], (err, user) => {
        if (err) {
            res.sendStatus(500)
        }
        if (user.rowCount === 1) {
            res.sendStatus(201)
        } else {
            res.sendStatus(500)
        }
    })
}

exports.login = (request, response) => {
    pool.query('SELECT * from users WHERE email = $1', [request.body.email], (err, res) => {
        const user = res.rowCount === 1 ? res.rows[0] : null;
        if (err || !request.body.password) {
            response.sendStatus(500)
        }
        if (user) {
            const validPassword = bcrypt.compareSync(request.body.password, user.password);
            if (validPassword) {
                const token = generateAccessToken()
                response.json({ token })
            } else {
                response.sendStatus(401)
            }
        } else {
            response.sendStatus(500)
        }
    })
}