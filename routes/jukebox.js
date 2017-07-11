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

	var messageText = req.body.message.trim().substring(0, 255);
	var username = req.body.username.trim();

	var message = new Message();
	message.text = messageText;
	message.username = username;

	message.save(function(error, response){
		console.log('Message saved', message);
	});

	return res.status(200).json({
		success: true
	});
}

module.exports = router;
