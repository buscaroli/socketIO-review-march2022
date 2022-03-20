const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const express = require('express')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDir = path.join(__dirname, '../public')
app.use(express.static(publicDir))

io.on('connection', (socket) => {
  console.log('Websocket connection up')

  // emit to this connection
  socket.emit('message', 'Welcome to the Chat!')

  // emit to everybody BUT this connection
  socket.broadcast.emit('message', 'A new user has joined')

  socket.on('sendMessage', (message, callback) => {
    // emit to everyone
    const filter = new Filter()

    if (filter.isProfane(message)) {
      return callback('Profanity not allowed')
    }
    io.emit('message', message)
    callback()
  })

  socket.on('sendLocation', ({ lat, lon }, callback) => {
    // console.log(`Location: (${lat}, ${lon})`)
    io.emit('message', `Location: https://google.com/maps?g=${lat},${lon}`)
    callback('Location Shared!')
  })

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left')
  })
})

server.listen(port, () => {
  console.log(`Server up on port ${port}...`)
})
