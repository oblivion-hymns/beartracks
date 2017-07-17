var bcrypt = require('bcryptjs');
var express = require('express');

var ObjectId = require('mongoose').Types.ObjectId;
var User = require('../models/user');

var router = express.Router();
router.post('/create', create);
router.post('/login', login);

/**
 * Validates the given username
 * @return boolean
 */
function isUsernameValid(username)
{
	return username.match(/^[A-Za-z0-9\.\-\_]{2,16}$/);
}

/**
 * Creates a new user
 * @return Response
 */
function create(req, res)
{
	var username = req.body.username;
	if (!username)
	{
		return res.status(400).json({
			success: false,
			message: 'Must provide a username'
		});
	}
	username = username.trim().toLowerCase();;

	if (!isUsernameValid(username))
	{
		return res.status(400).json({
			success: false,
			message: 'Usernames may only consist of alphanumerics (A-Z, 0-9) and the period (.), dash (-) and underline (_) characters'
		});
	}

	var password = req.body.password;
	if (!password)
	{
		return res.status(400).json({
			success: false,
			message: 'Must provide a password'
		});
	}

	password = password.trim();
	if (password.length < 8)
	{
		return res.status(400).json({
			success: false,
			message: 'Password must be at least 8 characters long'
		});
	}

	password = bcrypt.hashSync(password, 10);

	var user = new User({
		username: username,
		password: password
	});
	user.save(function(error){
		if (error)
		{
			return res.status(500).json({
				success: false,
				message: 'A user with that name already exists'
			});
		}

		return res.status(200).json({
			success: true
		});
	});
}

function login(req, res)
{

}

module.exports = router;
