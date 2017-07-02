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
	Track.find({}).sort('discNum, trackNum')
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

			tracks = tracks.sort(
				function(t1, t2)
				{
					//Is it a different album?
					if (t1.album.nameKey > t2.album.nameKey)
					{
						return 1;
					}
					else if (t1.album.nameKey < t2.album.nameKey)
					{
						return -1;
					}

					//Is it a different disc?
					if (t1.discNum > t2.discNum)
					{
						return 1;
					}
					else if (t1.discNum < t2.discNum)
					{
						return -1
					}

					//Must be a different track
					if (t1.trackNum > t2.trackNum)
					{
						return 1;
					}
					else if (t1.trackNum < t2.trackNum)
					{
						return -1
					}

					return 0;
				}
			);

			res.status(200).json({
				tracks: tracks
			});
	});
}

module.exports = router;
