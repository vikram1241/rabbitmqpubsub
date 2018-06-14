const socketio = require('socket.io');

let clientConnection;

const createSocketConnection = function(serverToBind) {
  let io = socketio(serverToBind);

  io.on('connection', (clientSocket) => {
    clientConnection = clientSocket;
    console.log(' connection to client ');
    clientSocket.on('PING', (msg) => {
      console.log(" message from client ", msg);
      clientSocket.emit('PONG', new Date());
    })

    clientSocket.on('SUBMISSION', (msg) => {
      console.log(' message from submission event ', msg);
      clientSocket.emit('REPLY', msg);
    })
  })
}

const emitEvent = function(evalObj) {
  console.log(" in socket server for emiting")
	clientConnection.emit('TESTING', evalObj)
}

console.log("clientConnection", clientConnection);


module.exports = {
  createSocketConnection,
  emitEvent
};