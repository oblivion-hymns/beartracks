var express = require('express');
var Levenshtein = require('levenshtein');
var ObjectId = require('mongoose').Types.ObjectId;

var Album = require('../models/album');

var router = express.Router();
router.get('/', baseRoute);
router.get('/loadForArtist', loadForArtist);
router.get('/recent', loadRecent);
router.get('/find', find);

function baseRoute(req, res)
{
	res.render('index');
}

/**
 * Returns a list of albums with a name like the given one
 */
function find(req, res)
{
	var query = req.query.query.trim();
	if (query.length > 2)
	{
		var filterQuery = {$text: {$search: query}};
		var scoreQuery =  {score: {$meta: 'textScore'}};
		var sortQuery = {score: {$meta: 'textScore'}};

		Album.find(filterQuery, scoreQuery).sort(sortQuery).populate('artist').exec(function(error, albums){
			if (error)
			{
				console.log(error);
				return res.status(500).json({
					title: 'An error occurred'
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

			albums = albums.slice(0, 15);

			res.status(200).json({
				message: 'Success',
				albums: albums
			});
		});
	}
}

/**
 * Returns a list of albums for the given Artist
 * @return Album[]
 */
function loadForArtist(req, res)
{
	var artistId = req.query.artistId;
	if (!artistId)
	{
		return res.status(500).json({
			message: 'An error occurred'
		});
	}

	Album.find({'artist': new ObjectId(artistId)}).sort('-year').populate('artist').exec(function(error, albums){
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
 * Returns a list of the most recently-uploaded albums
 * @return Album[]
 */
function loadRecent(req, res)
{
	Album.find({}).sort({_id: -1}).limit(25).populate('artist').exec(function(error, albums){
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

module.exports = router;
