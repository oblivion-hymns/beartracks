var express = require('express');
var fs = require('fs');

var Artist = require('../models/artist');

var router = express.Router();

router.get('/', baseRoute);
router.get('/all', loadAll);

/**
 * Renders index
 */
function baseRoute(req, res)
{
	res.render('index');
}

/**
 * Returns a list of all artists
 */
function loadAll(req, res)
{
	Artist.find({})
		.sort('nameKey')
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
}

module.exports = router;
