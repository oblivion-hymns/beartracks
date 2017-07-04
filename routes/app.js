var express = require('express');
var extend = require('util')._extend;
var fs = require('fs');
var id3 = require('id3-parser');
var jsonFile = require('jsonfile');
jsonFile.spaces = 2;

var mp3Duration = require('mp3-duration');
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
 * Parse ID3 tags for a given file
 */
function parseTags(filePath, allData, cache, cachePath)
{
	var fileObj = fs.readFileSync(filePath);
	return id3.parse(fileObj).then(tags => {

		if (!tags.artist || tags.artist == '')
		{
			console.error("Artist tag not found: " + filePath);
			throw "Artist tag not found: " + filePath;
		}
		else if (!tags['set-part'] || tags['set-part'] == '' || tags['set-part'] == 0)
		{
			console.error("Discnum tag not found: " + filePath);
			throw "Discnum tag not found: " + filePath;
		}
		else if (!tags.year || tags.year == '0000' || tags.year == '')
		{
			console.error("Year tag not found: " + filePath);
			throw "Year tag not found: " + filePath;
		}

		allData.push({
			path: filePath,
			tags: tags
		});

		cache.files.push(encodeURIComponent(filePath));
		jsonFile.writeFileSync(cachePath, cache);
	}).catch(function(reason){
		console.error(reason);
	});
}

/**
 * Saves an artist's data, including albums
 */
function saveArtist(artist, artistKey, artistData, music)
{
	Artist.findOneAndUpdate({'nameKey': artist.nameKey}, artist, {new: true, upsert: true}, function(error, artist){
		if (error)
		{
			console.error(error);
			throw error;
		}

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

			saveAlbums(artist, artistKey, album, albumKey, music);
		}
	});
}

/**
 * Saves an artist's albums, including tracks
 */
function saveAlbums(artist, artistKey, album, albumKey, music)
{
	Album.findOneAndUpdate({'nameKey': album.nameKey}, album, {new: true, upsert: true}, function(error, album){
		if (error)
		{
			console.error(error);
			throw error;
		}

		var allTracks = music[artistKey].albums[albumKey].tracks;

		//Tracks
		for (var trackKey in allTracks)
		{
			var trackData = allTracks[trackKey];
			console.log(album._id);
			var track = {
				name: trackData.name,
				nameKey: trackData.nameKey,
				album: album._id,
				discNum: trackData.discNum,
				trackNum: trackData.trackNum,
				genre: trackData.genre,
				length: null,
				filePath: trackData.filePath,
				originalPath: trackData.originalPath
			};

			saveTracks(artist, track);
		}
	});
}

/**
 * Saves an artist & album's tracks
 */
function saveTracks(artist, track)
{
	mp3Duration(track.originalPath, function(error, duration){
		track.length = Math.floor(parseInt(duration));
		Track.findOneAndUpdate({'nameKey': track.nameKey}, track, {new: true, upsert: true}, function(error, track){
			if (error)
			{
				console.error(error);
				throw error;
			}

			console.log('Saved track ', track.filePath);
		});
	});
}

/**
 * Syncs all music data
 */
function sync(req, res)
{
	var musicRoot = '/mnt/4432CB4E32CB4420/My Stuff/Music/A Winged Victory for the Sullen';
	//var musicRoot = '/mnt/4432CB4E32CB4420/My Stuff/Music';
	var files = recursiveReaddirSync(musicRoot);
	var allData = [];

	var complete = false;
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

	var currentFileCount = 0;
	var totalFileCount = files.length;

	var testIteration = 0;
	var testIterations = 2000;

	for (var i in files)
	{
		var file = files[i];
		var fileType = path.extname(file);
		currentFileCount++;

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
				var percentProgress = Math.floor((currentFileCount/totalFileCount) * 100);
				console.log('[' + percentProgress + '%] Adding ' + filePath);
				if (percentProgress >= 100)
				{
					complete = true;
				}

				testIteration++;
				promises.push(parseTags(filePath, allData, cache, cachePath));
			}
		}
		else
		{
			console.log('Skipped ' + file);
		}


		if (testIteration >= testIterations)
		{
			break;
		}
	}

	Promise.all(promises).then(values => {
		console.log('Organizing data to be saved...');

		var music = [];
		for (var i in allData)
		{
			var data = allData[i];
			var tags = data.tags;

			//Artist
			var artistName = null;
			try
			{
				artistName = tags.artist.replace(/\0/g, '');
			}
			catch (e)
			{
				console.error('Error retrieving artist name for ', data.path, ': ');
				throw e;
			}

			var artistNameKey = artistName.toLowerCase().replace(/ |\/|\(|\)|\'|\"|\?|\[|\]|\{|\}|\#|\,/g, '');

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
			var year = null;
			try
			{
				year = tags.year.replace(/\0/g, '');
			}
			catch (e)
			{
				console.error('Could not find year tag for: ', artistName, albumName);
				throw e;
			}

			var albumNameKey = artistNameKey + albumName.toLowerCase()
				.replace(/ |\/|\(|\)|\'|\"|\?|\[|\]|\{|\}|\#|\,/g, '') + year;
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
			var discNum = 0;
			if (tags['set-part'])
			{
				discNum = tags['set-part'].replace(/\0/g, '');
			}
			else
			{
				console.log('Could not find disc num for ' + artistKey + ' - "' + trackName + '"');
			}

			var trackNameKey = artistNameKey + albumNameKey + trackName.toLowerCase().replace(' ', '') + discNum + trackNum;

			var writePath = 'public/data/music/' + trackNameKey + '.mp3';
			var trackPath = '/data/music/' + trackNameKey + '.mp3';
			fs.createReadStream(data.path).pipe(fs.createWriteStream(writePath));

			music[artistNameKey].albums[albumNameKey].tracks.push({
				name: trackName,
				nameKey: trackNameKey,
				genre: genre,
				discNum: discNum,
				trackNum: trackNum,
				filePath: trackPath,
				originalPath: data.path
			});
		}

		//Artists
		console.log('Saving data...');
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

		return res.status(200).json({
			message: 'Success',
			complete: complete
		});

	}).catch(function(reason){
		console.error(reason);
		throw reason;
	});
}

module.exports = router;
