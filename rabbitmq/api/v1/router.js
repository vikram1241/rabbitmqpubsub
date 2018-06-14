const router = require('express').Router();
const publisher = require('../../publisher');

const publishEvent = function(req, res, next){
	let evalObj = {
		"name": req.body.name,
		"pwd": req.body.pwd
	}

	publisher(evalObj);
	next();
}

router.post('/', publishEvent, function(req, res){
	console.log("recieved request", req.body);
	res.send("published event").status(200);
})

module.exports = router;