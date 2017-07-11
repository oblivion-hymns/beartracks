var express = require('express');
var Levenshtein = require('levenshtein');

var Artist = require('../models/artist');

var router = express.Router();
router.get('/', baseRoute);
router.get('/all', loadAll);
router.get('/find', find);

/**
 * Renders index
 */
function baseRoute(req, res)
{
	res.render('index');
}

/**
 * Returns a list of artists with a name like the given one
 */
function find(req, res)
{
	var query = req.query.query.trim().toLowerCase().replace(/\W/g, '');
	if (query.length > 2)
	{
		var regex = new RegExp('.*' + query + '.*');
		Artist.find({nameKey: regex})
			.sort('nameKey')
			.exec(function(err, artists){
				if (err)
				{
					return res.status(500).json({
						title: 'An error occurred',
						error: err
					});
				}

				//Sort results based on levenshtein distance from original query
				artists = artists.sort(function(a, b){
					var aDistance = new Levenshtein(a.nameKey, query).distance;
					var bDistance = new Levenshtein(b.nameKey, query).distance;

					return aDistance - bDistance;
				});

				console.log(artists);

				res.status(200).json({
					message: 'Success',
					artists: artists
				});
			});
	}
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
				artists: artists
			});
		});
}

module.exports = router;
