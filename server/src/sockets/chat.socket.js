module.exports = function chatSocket(io, socket) {
  socket.on('chat:message', (data) => {
    io.emit('chat:message', {
      id: socket.id,
      text: data.text,
      timestamp: new Date(),
    })
  })

  socket.on('chat:join', (room) => {
    socket.join(room)
    socket.to(room).emit('chat:userJoined', { id: socket.id })
  })
}
