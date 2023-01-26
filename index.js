require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDb = require('./db')
const router = require('./routes/index');
const {notFound, errorHandler} = require('./middleware/errorMiddleware');

const PORT = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', router)

app.use(notFound)
app.use(errorHandler)
let server
const start = async () => {
    try {
        connectDb()
        server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}
start()

const io = require('socket.io')(server, {
    pingTimeout: 40000,
    cors: {
        origin: '*',
    }
})

io.on('connection', (socket) => {

    socket.on('setup', (userData) => {
        if (userData) {
            socket.join(userData._id)
            socket.emit('connected')
        }

    })

    socket.on('join chat', (room) => {
        if (room) {
            socket.join(room)
        }
    })

    socket.on('new message', (newMessageReceived) => {
        let chat = newMessageReceived.chat

        if (!chat.users) {
            return
        }

        chat.users.forEach(user => {
            socket.in(user._id).emit('message received', newMessageReceived)
        })
    })

    socket.off('setup', (userData) => {
        socket.leave(userData._id)
    })
})
