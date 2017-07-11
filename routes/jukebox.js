var express = require('express');
var Levenshtein = require('levenshtein');

var Artist = require('../models/artist');

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
	var message = req.body.post;
	console.log(message);
}

module.exports = router;
