const publisher = require('../publishExchange');

module.exports = function(evalObj) {
	console.log("publisher called");
  let eventObj = {
    event: evalObj.eventName,
    payload: evalObj
  };

  let exchangeName = 'topicExchange';
  let pattern = 'act.event.submission';
  let dataBuffer = new Buffer(JSON.stringify(eventObj))
  publisher(exchangeName, pattern, dataBuffer);
}