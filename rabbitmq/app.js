const bodyParser = require('body-parser');
// creating an express server
const express = require('express');
const app = express();
//const socket = require('./socketEvents');

//passing server instance to sockets
//socket.createSocketConnection(app);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//This function will create the excahnge of type `Topic` in rabbitmq
const registerConsumer = require('./consumer');
registerConsumer();

//Binding the middleware with server
app.use('/api/v1', require('./api/v1/index.js'));

// starting the server in 3000 port
/*app.listen(3300, () => {
	console.log(" server listening on port 3000");
})*/

module.exports = app;