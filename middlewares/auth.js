const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    if (req.methods === 'OPTIONS') {
        next()
    }
    const token = req?.headers?.authorization?.split(' ')[1]
    if (token) {
        const decodedData = jwt.verify(token, process.env.SECRET_JWT)
        req.user = decodedData
        next()
    } else {
        return res.sendStatus(403)
    }
}