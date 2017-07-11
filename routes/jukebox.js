var express = require('express');
var Levenshtein = require('levenshtein');

var Message = require('./../models/message');

var router = express.Router();
router.get('/', baseRoute);
router.post('/send-message', sendMessage);

/**
 * Renders index
 */
function baseRoute(req, res)
{
	res.render('index');
}

function sendMessage(req, res)
{
	if (!req.body.message)
	{
		return res.status(400).json({
			success: false,
			message: 'No message provided'
		});
	}
	else if (!req.body.username)
	{
		return res.status(400).json({
			success: false,
			message: 'No username provided'
		});
	}

	var message = req.body.message.trim();
	var username = req.body.username.trim();

	var message = new Message();
	message.text = message;
	message.username = username;

	message = message.slice(0, 255);

	message.save(function(error, response){
		console.log('Message saved', message);
	});
}

module.exports = router;
