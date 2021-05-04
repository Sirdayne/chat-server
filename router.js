const authController = require('./controllers/auth')
const usersController = require('./controllers/users')
const messagesController = require('./controllers/wsMessages')
const authMiddleware = require('./middlewares/auth')

exports.init = (app) => {
    app.post('/login', authController.login)
    app.post('/register', authController.register)
    app.get('/current-user', authMiddleware, authController.getCurrentUser)

    app.get('/users', authMiddleware, usersController.all)
    app.get('/users/:id', authMiddleware, usersController.findById)
}