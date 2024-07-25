const express = require('express')
const app = express()
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

const server = http.createServer(app)
const io = socketio(server)

app.set('view engine', 'ejs')

// Use this to serve static files like CSS and JS
app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', (socket) => {
  console.log('We have a new connection!!')

  socket.on('send-location', (coords) => {
    console.log(coords)
    io.emit('receive-location', { id: socket.id, ...coords })

    socket.on('disconnect', () => {
      io.emit('user-disconnected', socket.id)
      console.log('User disconnected')
    })
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

app.get('/', (req, res) => {
  res.render('index')
})

server.listen(4000, () => {
  console.log('listening on *:4000')
})
