var express = require('express');
var extend = require('util')._extend;
var fs = require('fs');
var id3 = require('id3-parser');
var musicMetadata = require('music-metadata');
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
	var tags;

	//Get tags
	var parsePromise = id3.parse(fileObj).then(tags => {
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

		return tags;
	});

	var durationPromise = parsePromise.then(function(tags) {
		return getTrackDuration(filePath, tags);
	});

	return Promise.all([parsePromise, durationPromise]).then(results => {
		console.log('Done parsing tags for ' + filePath);
		allData.push({
			path: filePath,
			tags: results[0]
		});

		cache.files.push(encodeURIComponent(filePath));
		jsonFile.writeFileSync(cachePath, cache);
	}).catch(function(reason){
		console.error(reason);
	});
}

/**
 * Gets the duration of the given track
 */
function getTrackDuration(track, tags)
{
	return musicMetadata.parseFile(track, {duration: true}).then(function(metadata) {
		if (metadata.format.duration)
		{
			tags.length = parseInt(metadata.format.duration);
		}
		else
		{
			console.error('Could not find track length for ', track.originalPath);
		}
	}).catch(function(error) {
		console.error(error.message);
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

		console.log('Saved artist ' + artist.name);

		//Albums
		var albums = artistData.albums;
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

		console.log('Saved album ' + album.name);

		var allTracks = music[artistKey].albums[albumKey].tracks;

		//Tracks
		for (var trackKey in allTracks)
		{
			var trackData = allTracks[trackKey];
			var track = {
				name: trackData.name,
				nameKey: trackData.nameKey,
				album: album._id,
				discNum: trackData.discNum,
				trackNum: trackData.trackNum,
				genre: trackData.genre,
				length: trackData.length,
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
	Track.findOneAndUpdate({'nameKey': track.nameKey}, track, {new: true, upsert: true}, function(error, track){
		if (error)
		{
			console.error(error);
			throw error;
		}

		console.log('Saved ' + artist.name + ' - "' + track.name + '"');
	});
}

/**
 * Syncs all music data
 */
function sync(req, res)
{
	//var musicRoot = '/mnt/4432CB4E32CB4420/My Stuff/Music/A Winged Victory for the Sullen';
	var musicRoot = '/mnt/4432CB4E32CB4420/My Stuff/Music';
	var files = recursiveReaddirSync(musicRoot);
	var allData = [];

	var complete = false;
	var cachePath = musicRoot + '/.bearcache.json';
	if (!fs.existsSync(cachePath))
	{
		jsonFile.writeFileSync(cachePath, {"files": []});
	}

	//jsonFile.writeFileSync(cachePath, {"files": []});

	//Manage artists
	var pathLookup = {};
	var promises = [];
	var cache = jsonFile.readFileSync(cachePath);

	var currentFileCount = 0;
	var totalFileCount = files.length;

	var currentIteration = 0;
	var totalIterations = 100;

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
				console.log('[' + percentProgress + '%] Queueing ' + filePath);
				if (percentProgress >= 100)
				{
					complete = true;
				}

				currentIteration++;
				promises.push(parseTags(filePath, allData, cache, cachePath));
			}
		}
		else
		{
			console.log('Skipped ' + file);
		}


		if (currentIteration >= totalIterations)
		{
			break;
		}
	}

	Promise.all(promises).then(values => {
		console.log('Organizing data to save...');

		var savePromises = [];
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
			var length = tags.length;
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

			var trackNameStripped = trackName.toLowerCase().replace(/ |\/|\(|\)|\'|\"|\?|\[|\]|\{|\}|\#|\,/g, '');
			var trackNameKey = artistNameKey + albumNameKey + trackNameStripped + discNum + trackNum;

			var writePath = 'public/data/music/' + trackNameKey + '.mp3';
			var trackPath = '/data/music/' + trackNameKey + '.mp3';
			fs.createReadStream(data.path).pipe(fs.createWriteStream(writePath));

			music[artistNameKey].albums[albumNameKey].tracks.push({
				name: trackName,
				nameKey: trackNameKey,
				genre: genre,
				discNum: discNum,
				trackNum: trackNum,
				length: length,
				filePath: trackPath,
				originalPath: data.path
			});
		}

		//Artists
		console.log('Saving data...');
		for (var artistKey in music)
		{
			var artistData = music[artistKey];null
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
