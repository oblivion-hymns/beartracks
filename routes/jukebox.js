var express = require('express');
var Message = require('./../models/message');

var router = express.Router();
router.get('/', baseRoute);
router.get('/load-recent', loadRecent);
router.post('/send-message', sendMessage);

/**
 * Renders index
 */
function baseRoute(req, res)
{
	res.render('index');
}

/**
 * Loads and returns the most recent 100 chat messages
 */
function loadRecent(req, res)
{
	Message.find({}).sort('-dateTime').limit(100).exec(function(err, messages){
		if (err)
		{
			return res.status(500).json({
				title: 'An error occurred',
				error: err
			});
		}

		messages = messages.sort(function(a, b){
			return a.dateTime - b.dateTime;
		});

		res.status(200).json({
			message: 'Success',
			messages: messages
		});
	});
}

/**
 * Sends a new chat message
 */
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
	message.system = false;

	message.save(function(){});

	return res.status(200).json({
		success: true
	});
}

module.exports = router;
