const pool = require('../services/pool').pool;

exports.all = (request, response) => {
    pool.query('SELECT * from users', (err, res) => {
        if (err) {
            response.sendStatus(500)
        }
        if (res && res.rows) {
            const users = res?.rows?.map(item => {
                const { id, email } = item
                return { id, email}
            })
            response.send(users)
        }
    })
}

exports.findById = (request, response) => {
    const id = parseInt(request.params.id);
    if (id) {
        pool.query('SELECT * from users WHERE id = $1', [id], (err, res) => {
            if (err) {
                response.sendStatus(500)
            }
            if (res && res.rows && res.rows.length === 1) {
                const user = res?.rows[0]
                const { id, email, role } = user
                response.send({ id, email, role })
            } else {
                response.sendStatus(404)
            }
        })
    } else {
        response.sendStatus(404)
    }
}

exports.updateColor = (request, response) => {
    try {
        pool.query('UPDATE users SET color = $2 WHERE id = $1', [request.params.id, request.body.color], (err, res) => {
            if (err) {
                response.sendStatus(500)
            }
            if (res.rowCount === 1) {
                response.sendStatus(200)
            } else {
                response.sendStatus(404)
            }
        })
    } catch(e) {
        response.sendStatus(500)
    }
}