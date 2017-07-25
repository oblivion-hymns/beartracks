var bodyParser = require('body-parser');
var express = require('express');
var Levenshtein = require('levenshtein');
var mongoose = require('mongoose');
var shuffleArray = require('shuffle-array');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Track = require('../models/track');
var genreMap = require('../genres');

var router = express.Router();
router.get('/', baseRoute);
router.get('/random', loadRandom);
router.get('/find', find);
router.get('/related', loadRelated);
router.post('/album', loadAlbum);
router.get('/increment-song', incrementSong);
router.get('/recent', loadRecentlyPlayed);
router.get('/genre-map', loadGenreMap);
router.get('/random-genre', loadRandomGenre);

function baseRoute(req, res)
{
	return res.render('index');
}

/**
 * Returns a list of tracks with a name like the given one
 */
function find(req, res)
{
	var query = req.query.query.trim();
	if (query.length > 2)
	{
		var populate = {
			path: 'album',
			populate: {
				path: 'artist',
				model: 'Artist'
			}
		};

		var regex = new RegExp(query, 'i');
		Track.find({name: regex}).sort('nameKey').populate('album').populate(populate).exec(function(err, tracks){
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
 * Finds a track related to the given track or genre
 * @return Track
 */
function loadRelated(req, res)
{
	var trackId = req.query.trackId || null;
	var genre = req.query.genre || null;

	if (trackId)
	{
		trackId = mongoose.Types.ObjectId(trackId);
	}

	var degree = req.query.degree;

	if (genre)
	{
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
	}
	else
	{
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
		.limit(15)
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
 * Loads and returns all tracks, in a random order, for the given artist
 * @return Track[]
 */
function loadArtist(req, res)
{
	var id = mongoose.Types.ObjectId(req.body.artistId);

	Album.find({artist: id}).exec(function(error, albums){
		return albums;
	}).then(function(albums){

		var albumIds = [];
		for (let i = 0; i < albums.length; i++)
		{
			albumIds.push(albums[i]._id);
		}

		Track.find({album: {$in: albumIds}}).populate('album').populate({
			path: 'album',
			populate: {
				path: 'artist',
				model: 'Artist'
			}
		}).exec(function(error, tracks){
			if (error)
			{
				console.log(error);
				return res.status(500).json({message: 'An error occurred'});
			}

			res.status(200).json({
				tracks: shuffleArray(tracks)
			});
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
 * Returns the genre map
 * @return String[]
 */
function loadGenreMap(req, res)
{
	return res.status(200).json({
		genres: genreMap.genres
	});
}

/**
 * Gets a related genre for the provided genre, to the provided degree.
 * Each additional degree is one more relationship that will be made before deciding on a result
 */
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

/**
 * Returns a random track in the given genre
 * @return Track
 */
function loadRandomGenre(req, res)
{
	var genre = req.query.genre;
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

				return res.status(200).json({
					track: track
				});
		});
	});
}

module.exports = router;
