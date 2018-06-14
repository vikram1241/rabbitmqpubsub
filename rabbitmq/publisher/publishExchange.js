const async = require('async');
const getAmqpConnection = require('../getAmqpConnection');

module.exports = function(exchangeName, pattern, dataBuffer, done) {
  async.waterfall([
    getAmqpConnection,
    getAmqpChannel,
    publishMsg.bind(null, exchangeName, pattern, dataBuffer)
  ], done);

  var channel = null;

  function getAmqpChannel(connection, callback) {
    if (channel) {
      return callback(null, channel);
    }

    connection.createChannel((err, newChannel) => {
      if (err) {
        return callback(err);
      }
      channel = newChannel;
      callback(null, channel);
    });
  }

  function publishMsg(exchangeName, pattern, dataBuffer, channel, callback) {
    //TBD, need to check if this has to be durable or not
    channel.assertExchange(exchangeName, 'topic', {durable: false});
    console.log("published to exchange");
    //channel.assertExchange('someexchange', 'topic', {durable: false});
    //routing key is mentioned, so that message is published to which has same routing key queues in the exchange
    channel.publish(exchangeName, "act.event.testing", dataBuffer);
    callback(null);
  }
}
