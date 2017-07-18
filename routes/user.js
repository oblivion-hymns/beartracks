var bcrypt = require('bcryptjs');
var express = require('express');

var ObjectId = require('mongoose').Types.ObjectId;
var User = require('../models/user');

var router = express.Router();
router.post('/create', create);
router.post('/login', login);

/**
 * Creates a new user
 * @return Response
 */
function create(req, res)
{
	//Validate username
	var username = req.body.username;
	if (!username)
	{
		return res.status(400).json({
			success: false,
			message: 'Must provide a username'
		});
	}
	username = username.trim().toLowerCase();

	if (!username.match(/^[A-Za-z0-9\.\-\_]*$/))
	{
		return res.status(400).json({
			success: false,
			message: 'Usernames must only consist of letters, numbers, and the symbols .-_'
		});
	}

	if (username.length < 3)
	{
		return res.status(400).json({
			success: false,
			message: 'Usernames must be at least 3 characters long'
		});
	}

	if (username.length > 16)
	{
		return res.status(400).json({
			success: false,
			message: 'Usernames must be 16 or fewer characters long'
		});
	}

	//Validate password
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

	if (password.length > 16)
	{
		return res.status(400).json({
			success: false,
			message: 'Password must be 16 or fewer characters long'
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
