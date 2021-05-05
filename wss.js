const wsMessagesController = require('./controllers/wsMessages')

const ws = require('ws')
const WS_PORT = process.env.WS_PORT || 5000

const wss = new ws.Server({
    port: 5000
}, () => console.log(`WebSocket started on ${WS_PORT}`))

wss.on('connection', function connection(ws) {

    ws.on('message', function(request) {

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
            const msg = {
                id: responseMessage.id,
                event: responseMessage.event,
                user_id: responseMessage.user_id,
                email: requestMessage.email,
                message: responseMessage.message,
                color: responseMessage.color,
                created_at: responseMessage.created_at
            }
            broadcastMessage(msg)
        }
    })
}

function broadcastMessage(msg) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(msg))
    })
}