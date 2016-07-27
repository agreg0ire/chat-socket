const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`)
})

io.on('connection', socket => {
  socket.broadcast.emit('new user connected', 'new user connected');

  socket.on('chat msg', msg => {
    socket.broadcast.emit('chat msg', msg)
  })

  socket.on('disconnect', () => socket.broadcast.emit('disconnected', 'someone disconnected'))
})

http.listen(3000, () => console.log('listenning on *:3000'))
