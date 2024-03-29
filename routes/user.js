var bcrypt = require('bcryptjs');
var express = require('express');
var jwt = require('jsonwebtoken');
var User = require('../models/user');

var router = express.Router();
router.post('/create', create);
router.post('/login', login);
router.post('/load', loadUser);
router.post('/change-password', changePassword);

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

	if (username.length > 24)
	{
		return res.status(400).json({
			success: false,
			message: 'Usernames must be 24 or fewer characters long'
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

	if (password.length > 24)
	{
		return res.status(400).json({
			success: false,
			message: 'Password must be 24 or fewer characters long'
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
	var username = req.body.username.trim();
	var password = req.body.password.trim();
	User.findOne({username: username}, function(error, user){
		if (error)
		{
			return res.status(500).json({
				success: false,
				message: 'Incorrect username or password'
			});
		}

		if (!user)
		{
			return res.status(500).json({
				success: false,
				message: 'Incorrect username or password'
			});
		}

		var validPassword = bcrypt.compareSync(password, user.password);
		if (!validPassword)
		{
			return res.status(401).json({
				title: 'Login failed',
				message: 'Incorrect username or password'
			});
		}

		var token = jwt.sign({user: user}, 'btsecret', {expiresIn: 604800});
		return res.status(200).json({
			message: 'Successfully logged in',
			token: token,
			userId: user._id,
			username: user.username
		});
	});
}

function loadUser(req, res)
{
	var userId = req.body.userId;
	User.findById(userId, function(error, user){
		if (error)
		{
			return res.status(500).json({
				success: false,
				message: 'User is not logged in'
			});
		}

		if (!user)
		{
			return res.status(200).json({
				success: true,
				username: null
			});
		}

		return res.status(200).json({
			success: true,
			username: user.username
		});
	});
}

function changePassword(req, res)
{
	var userId = req.body.userId;
	var password = req.body.currentPassword;
	var newPass = req.body.newPassword.trim();
	var newPassVerify = req.body.newPasswordVerify.trim();

	if (newPass != newPassVerify)
	{
		return res.status(400).json({
			success: false,
			message: 'New passwords do not match. Please re-enter'
		});
	}

	User.findById(userId, function(error, user){
		if (error || !user)
		{
			return res.status(500).json({
				success: false,
				message: 'Something went wrong. Try again in a bit'
			});
		}

		var validPassword = bcrypt.compareSync(password, user.password);
		if (!validPassword)
		{
			return res.status(401).json({
				title: 'Login failed',
				message: 'The current password you entered is incorrect'
			});
		}

		if (newPass.length < 8)
		{
			return res.status(400).json({
				success: false,
				message: 'New password must be at least 8 characters long'
			});
		}

		if (newPass.length > 24)
		{
			return res.status(400).json({
				success: false,
				message: 'New password must be 24 or fewer characters long'
			});
		}

		var newPassword = bcrypt.hashSync(newPass, 10);
		User.update({_id: userId}, { $set: {password: newPassword } }, function(error){
			if (error)
			{
				return res.status(500).json({
					success: false,
					message: 'Something went wrong. Try again in a bit'
				});
			}

			return res.status(200).json({
				message: 'Password changed successfully'
			});
		});
	});
}

module.exports = router;
