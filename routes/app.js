var express = require('express');
var extend = require('util')._extend;
var fs = require('fs');
var id3 = require('id3-parser');
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

function parseTags(filePath, allData, cache, cachePath)
{
	var fileObj = fs.readFileSync(filePath);
	return id3.parse(fileObj).then(tags => {
		allData.push({
			path: filePath,
			tags: tags
		});

		cache.files.push(encodeURIComponent(filePath));
		jsonFile.writeFileSync(cachePath, cache);

		console.log('Added ' + filePath);
	});
}

function saveArtist(artist, artistKey, artistData, music)
{
	Artist.findOneAndUpdate({'nameKey': artist.nameKey}, artist, {new: true, upsert: true}, function(error, artist){
		saveAlbum(artist, artistKey, artistData, music);
	});
}

function saveAlbum(artist, artistKey, artistData, music)
{
	var albums = artistData.albums;

	//Albums
	for (var albumKey in albums)
	{
		var albumData = music[artistKey].albums[albumKey];
		var album = {
			name: albumData.name,
			nameKey: albumData.nameKey,
			year: albumData.year,
			imagePath: albumData.imagePath,
			artist: artist._id
		};

		Album.findOneAndUpdate({'nameKey': album.nameKey}, album, {new: true, upsert: true}, function(error, album){
			if (error)
			{
				console.log(error);
			}
		});

		//Tracks
		for (var trackKey in artist.tracks)
		{

		}
	}
}

/**
 * Syncs all music data
 */
function sync(req, res)
{
	Artist.remove({}, function(error){
		if (error)
		{
			console.error('Error removing Artists: ');
			console.error(error);
		}
	});
	Album.remove({}, function(error){
		if (error)
		{
			console.error('Error removing Albums: ');
			console.error(error);
		}
	});
	Track.remove({}, function(error){});

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
	var pathLookup = {};
	var promises = [];
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
				console.log('Adding ' + filePath);
				promises.push(parseTags(filePath, allData, cache, cachePath));
			}
		}
		else
		{
			console.log('Skipped ' + file);
		}
	}

	Promise.all(promises).then(values => {
		//Now organize everything to be saved
		var music = [];
		for (var i in allData)
		{
			var data = allData[i];
			var tags = data.tags;

		//	console.log(data, tags);

			//Artist
			var artistName = tags.artist.replace(/\0/g, '');
			var artistNameKey = artistName.toLowerCase().replace(/ /g, '');

			if (!music[artistNameKey])
			{
				//Find artist image, if one exists
				var imagePath = null;
				var checkPath = path.dirname(data.path);

				//Attempt to find artist image
				for (var i = 0; i < 3; i++)
				{
					var potentialImagePath = checkPath + '/artist.png';
					if (fs.existsSync(potentialImagePath))
					{
						var writePath = 'public/img/artists/' + artistNameKey + '.png';
						imagePath = '/img/artists/' + artistNameKey + '.png';
						fs.createReadStream(potentialImagePath).pipe(fs.createWriteStream(writePath));
						break;
					}

					checkPath = path.dirname(checkPath);
				}

				music[artistNameKey] = {
					name: artistName,
					nameKey: artistNameKey,
					imagePath: imagePath,
					albums: []
				};
			}

			var albumName = tags.album.replace(/\0/g, '');
			var year = tags.year.replace(/\0/g, '');
			var albumNameKey = artistNameKey + albumName.toLowerCase().replace(/ /g, '').replace('/', '') + year;
			if (!music[artistNameKey].albums[albumNameKey])
			{
				var albumImagePath = null;
				var checkPath = path.dirname(data.path);

				//Attempt to find artist image
				for (var i = 0; i < 3; i++)
				{
					var potentialImagePath = checkPath + '/folder.png';
					var potentialImagePath2 = checkPath + '/folder.jpg';
					if (fs.existsSync(potentialImagePath))
					{
						var writePath = 'public/img/albums/' + albumNameKey + '.png';
						albumImagePath = '/img/albums/' + albumNameKey + '.png';
						fs.createReadStream(potentialImagePath).pipe(fs.createWriteStream(writePath));
						break;
					}
					else if (fs.existsSync(potentialImagePath2))
					{
						var writePath = 'public/img/albums/' + albumNameKey + '.jpg';
						albumImagePath = '/img/albums/' + albumNameKey + '.jpg';
						fs.createReadStream(potentialImagePath2).pipe(fs.createWriteStream(writePath));
						break;
					}

					checkPath = path.dirname(checkPath);
				}

				music[artistNameKey].albums[albumNameKey] = {
					imagePath: albumImagePath,
					name: albumName,
					nameKey: albumNameKey,
					year: year,
					tracks: []
				}
			}

			var trackName = tags.title.replace(/\0/g, '');
			var trackNum = '' + tags.track;
			trackNum = trackNum.replace(/\0/g, '');
			var genre = tags.genre.replace(/\0/g, '');
			var trackNameKey = artistNameKey + albumNameKey + trackName.toLowerCase().replace(' ', '') + trackNum;

			var discNum = 0;
			if (tags['set-part'])
			{
				discNum = tags['set-part'].replace(/\0/g, '');
			}
			else
			{
				console.log('Could not find disc num for ' + trackNameKey);
			}

			music[artistNameKey].albums[albumNameKey].tracks.push({
				name: trackName,
				nameKey: trackNameKey,
				length: null,
				genre: genre,
				discNum: discNum,
				trackNum: trackNum
			});
		}

		//Artists
		for (var artistKey in music)
		{
			var artistData = music[artistKey];
			var artistId = null;

			var artist = {
				name: artistData.name,
				nameKey: artistData.nameKey,
				imagePath: artistData.imagePath
			};

			saveArtist(artist, artistKey, artistData, music);
		}

		res.render('index');
	}).catch(function(reason){
		console.error(reason);
	});

}

module.exports = router;
