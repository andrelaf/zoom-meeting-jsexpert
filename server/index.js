const server = require('http').createServer((request, response) => {
  response.writeHead(204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
  })
  response.end('hey there')
})

const socketIo = require('socket.io')
const io = socketIo(server,{
  cors: {
    origin: '*',
    credentials: false
  }
})

io.on('connection', socket => {
  console.log('connection', socket.id)
  socket.on('join-room', (roomId, userId) => {
    // todos os usuarios que chegar na sala menos ele mesmo
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)
    socket.on('disconnected', () => {
      console.log('disconnected!', roomId, userId)
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

const startServer = () => {
  const { address, port } = server.address()
  console.log(`app running at ${address}:${port}`)
}

server.listen(process.env.PORT || 3000, startServer)