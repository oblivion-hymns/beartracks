var express = require('express');

var Artist = require('../models/artist');
var Album = require('../models/album');

var router = express.Router();
router.get('/', baseRoute);
router.get('/all', loadAll);

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

module.exports = router;
