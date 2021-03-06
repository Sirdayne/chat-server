const wsMessagesController = require('./controllers/wsMessages')

const ws = require('ws')
const WS_PORT = process.env.WS_PORT || 5000

const wss = new ws.Server({
    port: 5000
}, () => console.log(`WebSocket started on ${WS_PORT}`))

wss.on('connection', (ws) => {
    ws.on('message', (request) => {
        const requestMessage = JSON.parse(request)
        if (requestMessage.event === 'message' && requestMessage.user_id && requestMessage.message) {
            addMessage(requestMessage)
        } else if (requestMessage.event === 'connection') {
            addMessage(requestMessage)
            wsMessagesController.getMessages((err, res) => {
                const messages = res && res.rows ? res.rows : []
                ws.send(JSON.stringify({ event: 'get-all-messages', messages }))
            })
        }
    })
})

function addMessage(requestMessage) {
    const payload = { user_id: requestMessage.user_id, message: requestMessage.message, event: requestMessage.event }
    wsMessagesController.addMessageAndReturnWithColor(payload, (err, res) => {
        const responseMessage = res && res.rows && res.rows[0] ? res.rows[0] : null
        if (responseMessage && responseMessage.id) {
            const { id, event, user_id, message, color, created_at } = responseMessage
            const { email } = requestMessage
            const msg = { id, event, user_id, email, message, color, created_at}
            broadcastMessage(msg)
        }
    })
}

function broadcastMessage(msg) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(msg))
    })
}