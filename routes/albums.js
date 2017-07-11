var express = require('express');
var Levenshtein = require('levenshtein');

var Artist = require('../models/artist');
var Album = require('../models/album');

var router = express.Router();
router.get('/', baseRoute);
router.get('/all', loadAll);
router.get('/find', find);

function baseRoute(req, res)
{
	res.render('index');
}

function loadAll(req, res)
{
	Album.find({}).sort('nameKey').populate('artist').exec(function(error, albums){
		if (error)
		{
			console.log(error);
			return res.status(500).json({
				message: 'An error occurred'
			});
		}

		res.status(200).json({
			albums: albums
		});
	});
}

/**
 * Returns a list of albums with a name like the given one
 */
function find(req, res)
{
	var query = req.query.query.trim().toLowerCase().replace(/\W/g, '');
	if (query.length > 2)
	{
		var regex = new RegExp('.*' + query + '.*', 'i');
		Album.find({nameKey: regex}).sort('nameKey').exec(function(err, albums){
			if (err)
			{
				return res.status(500).json({
					title: 'An error occurred',
					error: err
				});
			}

			//Sort results based on levenshtein distance from original query
			albums = albums.sort(function(a, b){
				//Do not include artist
				var aKey = a.name.trim().toLowerCase();
				var bKey = b.name.trim().toLowerCase();

				var aDistance = new Levenshtein(aKey, query).distance;
				var bDistance = new Levenshtein(bKey, query).distance;

				return aDistance - bDistance;
			});

			albums = albums.slice(0, 10);

			res.status(200).json({
				message: 'Success',
				albums: albums
			});
		});
	}
}

module.exports = router;
