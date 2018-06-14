const publisher = require('./publishExchange');

module.exports = function(evalObj) {
  let eventObj = {
    event: "someevent",
    payload: evalObj
  };

  let exchangeName = 'topicExchange';
  let pattern = 'act.event.submission';
  let dataBuffer = new Buffer(JSON.stringify(eventObj))
  publisher(exchangeName, pattern, dataBuffer);
}