const amqp = require('amqplib/callback_api');

let connection = null;

module.exports = function(callback) {
  if(connection) {
  	return callback(null, connection);
  }

  amqp.connect('amqp://localhost', (err, newConnection) => {
    if(err) {
    	console.log("error in creating rabbitmq connection", err);
    	return callback(err);
    }

    console.log('AMQP connected ..!');
    connection = newConnection;
    return callback(null, connection);
  });
};