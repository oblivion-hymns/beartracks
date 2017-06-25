var express = require('express');
var router = express.Router();

var Artist = require('../models/artist');

router.get('/', function(req, res, next){
	res.render('index');
});

router.get('/', function(req, res, next){
	Artist.find()
		.exec(function(err, artists){
			if (err)
			{
				return res.status(500).json({
					title: 'An error occurred',
					error: err
				});
			}
			res.status(200).json({
				message: 'Success',
				obj: artists
			});
		});
});

module.exports = router;
