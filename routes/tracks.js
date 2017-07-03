var express = require('express');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Track = require('../models/track');

var router = express.Router();
router.get('/', baseRoute);
router.get('/all', loadAll);

function baseRoute(req, res)
{
	res.render('index');
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
