const sockets = require('../socketEvents');

module.exports = function(evalObj) {
	console.log("in socket event worker", evalObj);
	sockets.emitEvent(evalObj);
}