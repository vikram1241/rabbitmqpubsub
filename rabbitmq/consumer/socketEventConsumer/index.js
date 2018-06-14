const registerReciever = require('../registerReciever');

module.exports = function(){
	registerReciever('topicExchange', require('../socketWorker'));
}