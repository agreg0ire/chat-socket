const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
let ip = null

app.get('/', (req, res) => {
  ip = req.headers["X-Forwarded-For"] || req.headers["x-forwarded-for"] || req.client.remoteAddress
  res.sendFile(`${__dirname}/index.html`)
})

app.use(express.static('public'))

io.on('connection', socket => {
  socket.broadcast.emit('new user connected', `<b><u>${ip}</u></b> connected`);

  socket.on('chat msg', msg => socket.broadcast.emit('chat msg', `<b><u>${ip} said:</u></b> ${msg}`))

  socket.on('isTyping', msg => socket.broadcast.emit('isTyping', ip))

  socket.on('disconnect', () => socket.broadcast.emit('disconnected', `<b><u>${ip}</u></b> disconnected`))
})

http.listen(3000, () => console.log('listenning on *:3000'))
