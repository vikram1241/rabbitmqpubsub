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
    //register for event pattern
    let pattern = 'LCEvents.*';

    channel.assertExchange(exchange, 'topic', { durable: false });
    channel.assertQueue('', { exclusive: false, durable: true }, function(err, q){
      // this will bind the rabbitmq default queue
      channel.bindQueue(q.queue, exchange, pattern);

      channel.consume(q.queue, (msgBuffer) => {
        try {
          const msg = JSON.parse(msgBuffer.content.toString());
          receiver(msg, (err) => {
            if (err) { channel.nack(msgBuffer); return; }
            channel.ack(msgBuffer);
          });
        } catch (err) {
          console.log('Error in receiving message:', msgBuffer.content.toString());
          console.log('ERR:', err);
          // channel.ack(msgBuffer);
        }
      }, {noAck: true});
    }); // Let the queue persist even after the connection closes
	}
}