const expect = require('chai').expect;
const wsServer = require('../socketEvents');
const http = require('http');

describe('Websocket server tests', function(){
	let server = undefined;

	before(function(done) {
		server = http.createServer(() => console.log(" -/- "));
		wsServer.createSocketConnection(server);
		server.listen(7575, () => { console.log("BEFORE"); done(); });
	});

	after(function(done) {
		if(server) {
			server.on('close', () => { console.log('AFTER');  });
			server.close(() => { console.log('CLOSING'); server.unref(); });
			done();
		}
	});

		const wsClient = require('socket.io-client')('http://localhost:7575/');
	it('PING Test', function(done) {
		wsClient.on('connection', () => console.log('Client connected'));
		wsClient.emit('PING', '');
		wsClient.on('PONG', (data) => {expect(typeof data).to.equal('string'); done();});
	});

	it('submission test', function(done) {
		//const wsClient = require('socket.io-client')('http://localhost:7575/');
		//wsClient.on('connection', () => console.log('Client connected'));
		wsClient.emit('SUBMISSION', {"name" : "vikram"});
		wsClient.on('REPLY', (data) => {
			expect(data.name).to.equal('vikram');
		});
		done();
	})

	it(' testing socket event emiter', function(done){
		this.timeout(6000);
		const publisher = require('../publisher');
		let evalObj = {
			"eventName" : "submissionEvent",
			"payload" : {
				"name": "vikram",
				"submission" : new Date()
			}
		}

		publisher(evalObj);

		wsClient.on('TESTING', (data) => {
			expect(data.eventName).to.equal('submissionEvent');
		});
		  done();
	})
})