var bodyParser = require('body-parser');
var express = require('express');
var Levenshtein = require('levenshtein');
var mongoose = require('mongoose');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Track = require('../models/track');

var router = express.Router();
router.get('/', baseRoute);
router.get('/random', loadRandom);
router.get('/all', loadAll);
router.get('/find', find);
router.post('/album', loadAlbum);
router.get('/increment-song', incrementSong);

function baseRoute(req, res)
{
	res.render('index');
}

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
 * Returns a list of albums with a name like the given one
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

function loadAll(req, res)
{
	Track.find({})
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
				var t1sortKey = t1.nameKey.replace(t1.album.nameKey, '');
				var t2sortKey = t2.nameKey.replace(t2.album.nameKey, '');
				if (t1sortKey > t2sortKey)
				{
					return 1;
				}
				else if (t1sortKey < t2sortKey)
				{
					return -1;
				}
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

module.exports = router;
