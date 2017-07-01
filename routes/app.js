var express = require('express');
var extend = require('util')._extend;
var fs = require('fs');
var id3 = require('node-id3');
var jsonFile = require('jsonfile');
jsonFile.spaces = 2;

var path = require('path');
var recursiveReaddirSync = require('recursive-readdir-sync');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Track = require ('../models/track');

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
	Artist.remove({});
	Album.remove({});
	Track.remove({});

	//var musicRoot = '/mnt/4432CB4E32CB4420/My Stuff/Music';
	var musicRoot = '/mnt/4432CB4E32CB4420/[Temp]/test';
	var files = recursiveReaddirSync(musicRoot);
	var allData = [];

	var cachePath = musicRoot + '/.bearcache.json';
	if (!fs.existsSync(cachePath))
	{
		jsonFile.writeFileSync(cachePath, {"files": []});
	}

	jsonFile.writeFileSync(cachePath, {"files": []});

	//Manage artists
	var cache = jsonFile.readFileSync(cachePath);
	for (var i in files)
	{
		var file = files[i];
		var fileType = path.extname(file);

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
			else if (file.indexOf('folder.png') > -1 || file.indexOf('folder.jpg') > -1)
			{
				isAlbumArt = true;
			}
			else if (file.indexOf('artist.png') > -1)
			{
				isArtistArt = true;
			}

			allData.push({
				isAlbumArt: isAlbumArt,
				isArtistArt: isArtistArt,
				isSong: isSong,
				path: filePath,
				tags: tags
			});

			cache.files.push(encodeURIComponent(file));
			jsonFile.writeFileSync(cachePath, cache);

			console.log('Added ' + filePath);
		}
		else
		{
			console.log('Skipped ' + file);
		}
	}

	//Now organize everything to be saved
	var music = [];
	for (var i in allData)
	{
		var data = allData[i];

		if (data.isSong)
		{
			var tags = data.tags;

			//Artist
			var artistName = tags.artist.replace(/\0/g, '');
			var artistNameKey = artistName.toLowerCase().replace(' ', '');

			if (!music[artistNameKey])
			{
				music[artistNameKey] = {
					name: artistName,
					nameKey: artistNameKey,
					albums: []
				};
			}

			var albumName = tags.album.replace(/\0/g, '');
			var year = tags.year.replace(/\0/g, '');
			var albumNameKey = artistNameKey + albumName.toLowerCase().replace(' ', '') + year;
			if (!music[artistNameKey].albums[albumNameKey])
			{
				//Album art
				var imagePath = null;
				if (data.tags.image.imageBuffer)
				{
					var imageBuffer = data.tags.image.imageBuffer;
					imagePath = 'public/img/albums/' + albumNameKey + '.png';
					fs.writeFile(imagePath, imageBuffer, 'base64', function(err) {
						console.log(err);
					});
				}

				music[artistNameKey].albums[albumNameKey] = {
					imagePath: imagePath,
					name: albumName,
					nameKey: albumNameKey,
					year: year,
					tracks: []
				}
			}

			var trackName = tags.title.replace(/\0/g, '');
			var discNum = tags.partOfSet.replace(/\0/g, '');
			var trackNum = tags.trackNumber.replace(/\0/g, '');
			var genre = tags.genre.replace(/\0/g, '');
			var trackNameKey = artistNameKey + albumNameKey + trackName.toLowerCase().replace(' ', '') + trackNum;
			music[artistNameKey].albums[albumNameKey].tracks.push({
				name: trackName,
				nameKey: trackNameKey,
				length: null,
				genre: genre,
				discNum: discNum,
				trackNum: trackNum
			});
		}
	}


	//Artists
	for (var artistKey in music)
	{
		var artistData = music[artistKey];
		var artistId = null;

		var artist = new Artist();
		artist.name = artistData.name;
		artist.nameKey = artistData.nameKey;

		Artist.findOneAndUpdate({'nameKey': artist.nameKey}, artist, {new: true, upsert: true});

		var albums = artistData.albums;

		//Albums
		for (var albumKey in albums)
		{
			var albumData = music[artistKey].albums[albumKey];
			var album = new Album();
			album.name = albumData.name;
			album.nameKey = albumData.nameKey;
			album.year = albumData.year;
			album.artist = artist._id;

			Album.findOneAndUpdate({'nameKey': album.nameKey}, album, {new: true, upsert: true}, function(error, album){
				console.log(error);
			});

			//Tracks
			for (var trackKey in artist.tracks)
			{

			}
		}
	}

	res.render('index');
}

module.exports = router;
