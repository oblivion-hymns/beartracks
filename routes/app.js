var express = require('express');
var extend = require('util')._extend;
var fs = require('fs');
var id3 = require('node-id3');
var path = require('path');
var recursiveReaddirSync = require('recursive-readdir-sync');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require ('../models/song');

var router = express.Router();
router.get('/', baseRoute);
router.post('/sync', sync);

/**
 * Base route
 */
function baseRoute(req, res)
{
	res.render('index');
}

/**
 * Syncs all music data
 */
function sync(req, res)
{
	Artist.deleteMany({});
	Album.deleteMany({});
	Song.deleteMany({});

	//var musicRoot = '/mnt/4432CB4E32CB4420/My Stuff/Music';
	var musicRoot = '/mnt/4432CB4E32CB4420/[Temp]/test';
	var files = recursiveReaddirSync(musicRoot);
	var allData = [];

	console.log('Scanning files for data...');

	var cache = {};
	var cacheFilePath = null;

	//Prune for artists
	for (var i in files)
	{
		var file = files[i];
		var fileType = path.extname(file);

		var isCache = (file.indexOf('.cache.json') > -1);
		if (isCache)
		{
			cacheFilePath = file;
			var cacheFile = require(cacheFilePath);
			cache = extend(cache, cacheFile);
		}

		var cached = cache.files.indexOf(encodeURIComponent(file)) != -1;
		if (!cached)
		{
			var isAlbumArt = false;
			var isArtistArt = false;
			var isSong = false;
			var filePath = file;
			var tags = null;

			if (fileType == '.mp3')
			{
				tags = id3.read(file);
				isSong = true;
			}
			else if (file.indexOf('folder.png') > -1)
			{
				isAlbumArt = true;
			}
			else if (file.indexOf('artist.png') > -1)
			{
				isArtistArt = true;
			}

			console.log('Adding ' + filePath);

			allData.push({
				isAlbumArt: isAlbumArt,
				isArtistArt: isArtistArt,
				isSong: isSong,
				path: filePath,
				tags: tags
			});

			cache.files.push(encodeURIComponent(file));
			var json = JSON.stringify(cache);
			fs.writeFile(cacheFilePath, json, 'utf8', function(){});
		}
		else
		{
			if (!isCache)
			{
				console.log('Skipping ' + file);
			}
		}
	}

	var dataByArtist = {};
	for (var i in allData)
	{
		var data = allData[i];
		var tags = data.tags;

		if (data.isSong)
		{
			//Artist
			var artistName = tags.artist;
			var artistNameKey = tags.artist.toLowerCase().replace(' ', '');

			if (!dataByArtist[artistNameKey])
			{
				dataByArtist[artistNameKey] = {
					name: artistName,
					nameKey: artistNameKey,
					albums: []
				};
			}

			var albumName = tags.album;
			var year = tags.year;
			var albumNameKey = artistNameKey + albumName.toLowerCase().replace(' ', '') + year;
			if (!dataByArtist[artistNameKey][albumNameKey])
			{
				dataByArtist[artistNameKey][albumNameKey] = {
					name: albumName,
					nameKey: albumNameKey,
					year: year,
					songs: []
				}
			}

			//Determine disc number
			var discNum = 1;
			var dirName = path.dirname(data.path).split('/').pop();
			if (dirName.match(/^Disc d+$/))
			{
				var matches = str.match(/\d+$/);
				if (matches)
				{
					discNum = matches[0];
				}
			}

			var trackName = tags.title;
			var trackNum = tags.trackNumber;
			var genre = tags.genre;
			var trackNameKey = artistNameKey + albumNameKey + trackName.toLowerCase().replace(' ', '') + trackNum;
			if (!dataByArtist[artistNameKey][albumNameKey][discNum])
			{
				dataByArtist[artistNameKey][albumNameKey][discNum] = [];
			}

			if (!dataByArtist[artistNameKey][albumNameKey][discNum][trackNum])
			{
				dataByArtist[artistNameKey][albumNameKey][discNum][trackNum] = {
					name: trackName,
					nameKey: trackNameKey,
					length: null,
					genre: genre,
					discNum: discNum,
					trackNum: trackNum
				};
			}
		}
	}

	res.render('index');
}

module.exports = router;
