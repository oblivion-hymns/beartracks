var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Track = require('../models/track');

var router = express.Router();
router.get('/', baseRoute);
router.get('/all', loadAll);
router.post('/album', loadAlbum);

function baseRoute(req, res)
{
	res.render('index');
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

module.exports = router;
