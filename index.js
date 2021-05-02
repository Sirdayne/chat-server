require('dotenv').config()


const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const ws = require('ws')

const WS_PORT = process.env.WS_PORT || 5000

const wss = new ws.Server({
    port: 5000
}, () => console.log(`WebSocket started on ${WS_PORT}`))

wss.on('connection', function connection(ws) {

    ws.on('message', function(message) {

        message = JSON.parse(message)

        if (message.event === 'message') {
            broadcastMessage(message)
        } else if (message.event === 'connection') {
            broadcastMessage(message)
        }

    })

})

function broadcastMessage(message) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(message))
    })
}

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

let router = require('./router')
router.init(app)

const PORT = process.env.APP_PORT || 3012;

app.listen(PORT, () => {
    console.log(`Chart Server started on port ${PORT}`)
})

