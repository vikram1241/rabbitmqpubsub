const async = require('async');
const getAmqpConnection = require('../getAmqpConnection');

module.exports = function(exchange, receiver){

	async.waterfall([
		getAmqpConnection,
		getAmqpChannel,
		subscribeToExchange.bind(null, exchange, receiver)
	])

  let channel = null;

  function getAmqpChannel(connection, callback) {
    if (channel) {
      callback(null, channel);
      return;
    }

    connection.createChannel((err, newChannel) => {
      if (err) {
        callback(err);
        return;
      }

      channel = newChannel;
      callback(null, channel);
    });
  }

	function subscribeToExchange(exchange, receiver, callback){
    let pattern = ['act.event.*', 'int.event.*']; //register for event pattern
    channel.assertExchange(exchange, 'topic', { durable: false });
    // we need to make sure that RabbitMQ will never lose our queue. In order to do so, we need to declare it as durable:
    // Let the queue persist even after the connection closes
    channel.assertQueue('', { exclusive: false, durable: true }, function(err, q){

      pattern.forEach((key) => {
        channel.bindQueue(q.queue, exchange, key);
      })
      // if we use prefetch with value 1 the rabbitmq will send one msg to worker id it is free then only it will send another msg
      // This tells RabbitMQ not to give more than one message to a worker at a time
      channel.prefetch(1);
      channel.consume(q.queue, (msgBuffer) => {
        try {
          const msg = JSON.parse(msgBuffer.content.toString());
          console.log("msg", msg);
          // based on event and routekey reciever will be changed
          receiver(msg, (err) => {
            if (err) { channel.nack(msgBuffer); return; }
            channel.ack(msgBuffer);
          });
        } catch (err) {
          console.log('Error in receiving message:', msgBuffer.content.toString());
          console.log('ERR:', err);
          // channel.ack(msgBuffer);
        }
      });
    });
	}
}