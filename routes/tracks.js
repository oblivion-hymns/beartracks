var bodyParser = require('body-parser');
var express = require('express');
var Levenshtein = require('levenshtein');
var mongoose = require('mongoose');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Track = require('../models/track');
var genreMap = require('../genres');

var router = express.Router();
router.get('/', baseRoute);
router.get('/random', loadRandom);
router.get('/find', find);
router.post('/related', loadRelated);
router.post('/album', loadAlbum);
router.get('/increment-song', incrementSong);
router.get('/recent', loadRecentlyPlayed);

function baseRoute(req, res)
{
	res.render('index');
}

function getRelatedGenre(genre, degree)
{
	for (var i = 0; i < genreMap.genres.length; i++)
	{
		var genreInfo = genreMap.genres[i];
		if (genre == genreInfo.name)
		{
			return genreInfo.related[Math.floor(Math.random() * genreInfo.related.length)];
		}
	}
}

function loadRelated(req, res)
{
	var trackId = mongoose.Types.ObjectId(req.query.trackId);
	var degree = req.query.degree;

	Track.find({_id: trackId}, function(error, data){

		if (error)
		{
			console.error(error);
			return res.status(500).json({
				message: 'An error occurred'
			});
		}

		var genre = data[0].genre;
		for (var i = 0; i < degree; i++)
		{
			genre = getRelatedGenre(genre);
		}

		Track.count({genre: genre}).exec(function(error, count){
			var random = Math.floor(Math.random() * count);
			Track.findOne({genre: genre})
				.skip(random)
				.populate('album')
				.populate({
					path: 'album',
					populate: {
						path: 'artist',
						model: 'Artist'
					}
				})
				.exec(function(error, track){
					if (error)
					{
						console.log(error);
						return res.status(500).json({
							message: 'An error occurred'
						});
					}

					res.status(200).json({
						track: track
					});
			});
		});
	});


}

/**
 * Returns a completely randomly-selected track
 */
function loadRandom(req, res)
{
	Track.count().exec(function(error, count){
		var random = Math.floor(Math.random() * count);

		Track.findOne()
			.skip(random)
			.populate('album')
			.populate({
				path: 'album',
				populate: {
					path: 'artist',
					model: 'Artist'
				}
			})
			.exec(function(error, track){
				if (error)
				{
					console.log(error);
					return res.status(500).json({
						message: 'An error occurred'
					});
				}

				res.status(200).json({
					track: track
				});
		});
	});
}

/**
 * Returns a list of tracks with a name like the given one
 */
function find(req, res)
{
	var query = req.query.query.trim().toLowerCase().replace(/\W/g, '');
	if (query.length > 2)
	{
		var populate = {
			path: 'album',
			populate: {
				path: 'artist',
				model: 'Artist'
			}
		};

		var regex = new RegExp('.*' + query + '.*', 'i');
		Track.find({nameKey: regex}).sort('nameKey').populate('album').populate(populate).exec(function(err, tracks){
			if (err)
			{
				return res.status(500).json({
					title: 'An error occurred',
					error: err
				});
			}

			//Sort results based on levenshtein distance from original query
			tracks = tracks.sort(function(a, b){
				//Do not include artist
				var aKey = a.name.trim().toLowerCase();
				var bKey = b.name.trim().toLowerCase();

				var aDistance = new Levenshtein(aKey, query).distance;
				var bDistance = new Levenshtein(bKey, query).distance;

				return aDistance - bDistance;
			});

			tracks = tracks.slice(0, 15);

			res.status(200).json({
				message: 'Success',
				tracks: tracks
			});
		});
	}
}

/**
 * Loads and returns all tracks, in order, on the given album
 */
function loadAlbum(req, res)
{
	var id = mongoose.Types.ObjectId(req.body.albumId);

	Track.find({album: id})
		.populate('album')
		.populate({
			path: 'album',
			populate: {
				path: 'artist',
				model: 'Artist'
			}
		})
		.exec(function(error, tracks){
			if (error)
			{
				console.log(error);
				return res.status(500).json({
					message: 'An error occurred'
				});
			}

			tracks = tracks.sort(function(t1, t2){
				if (t1.discNum > t2.discNum)
				{
					return 1;
				}
				else if (t1.discNum < t2.discNum)
				{
					return -1;
				}

				return (t1.trackNum - t2.trackNum);
			});

			res.status(200).json({
				tracks: tracks
			});
	});
}

/**
 * Increases the play count of a track by track ID
 */
function incrementSong(req, res)
{
	Track.findByIdAndUpdate(req.query.trackId, {$inc: {playCount: 1}}, function(error, data){
		if (error)
		{
			console.error(error);
			return res.status(500).json({
				message: 'An error occurred'
			});
		}

		return res.status(200).json({});
	});
}

/**
 * Loads the most recently-played tracks
 */
function loadRecentlyPlayed(req, res)
{
	Track.find({playCount: {$gt: 0}})
		.populate('album')
		.populate({
			path: 'album',
			populate: {
				path: 'artist',
				model: 'Artist'
			}
		})
		.sort('-updatedAt')
		.limit(50)
		.exec(function(error, tracks){
			if (error)
			{
				console.log(error);
				return res.status(500).json({
					message: 'An error occurred'
				});
			}

			res.status(200).json({
				tracks: tracks
			});
	});
}

module.exports = router;
