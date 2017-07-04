var express = require('express');
var fs = require('fs');
var id3 = require('id3-parser');
var musicMetadata = require('music-metadata');
var path = require('path');
var recursiveReaddirSync = require('recursive-readdir-sync');
var jsonFile = require('jsonfile');
jsonFile.spaces = 2;

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
	var parsePromise = musicMetadata.parseFile(filePath, {duration: true}).then(function(metadata) {
		var tags = metadata.common;

		if (!tags.artist || tags.artist == '')
		{
			console.error("Artist tag not found: " + filePath);
			throw "Artist tag not found: " + filePath;
		}
		else if (!tags.disk.no || tags.disk.no == 0)
		{
			console.error("Discnum tag not found: " + filePath);
			throw "Discnum tag not found: " + filePath;
		}
		else if (!tags.year || tags.year == '0000' || tags.year == '')
		{
			console.error("Year tag not found: " + filePath);
			throw "Year tag not found: " + filePath;
		}

		if (metadata.format.duration)
		{
			tags.length = parseInt(metadata.format.duration);
		}
		else
		{
			console.error('Could not find track length for ', track.originalPath);
		}

		allData.push({
			path: filePath,
			tags: tags
		});

		cache.files.push(encodeURIComponent(filePath));
		jsonFile.writeFile(cachePath, cache, function(error, data){
			if (error)
			{
				console.error(error);
			}
		});

		console.log('Done parsing tags for ' + filePath);

	}).catch(function(error) {
		console.error(error.message);
	});

	/*var durationPromise = parsePromise.then(function(tags) {
		return getTrackDuration(filePath, tags);
	});*/

	/*fs.readFile(filePath, function(error, data){
		var tags;

		//Get tags
		/*var parsePromise = id3.parse(data).then(tags => {
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
		});*/

		/*var parsePromise = musicMetadata.parseFile(track, {duration: true}).then(function(metadata) {
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

		/*var durationPromise = parsePromise.then(function(tags) {
			return getTrackDuration(filePath, tags);
		});*/

		/*return Promise.all([parsePromise, durationPromise]).then(results => {
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
	});*/
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
	//Artist
	var artistPromise = Artist.findOneAndUpdate({'nameKey': artist.nameKey}, artist, {new: true, upsert: true}).exec();
	artistPromise.then(function(artist){
		return artist;
	});

	//Albums
	var albumPromise = artistPromise.then(function(artist){
		var albums = artistData.albums;
		var promiseAlbums = [];
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

			promiseAlbums.push(album);
		}

		return promiseAlbums;

	}).then(function(albums){

		var albumPromises = [];
		for (var i in albums)
		{
			var album = albums[i];
			var albumSavePromise = Album.findOneAndUpdate({'nameKey': album.nameKey}, album, {new: true, upsert: true}).exec();
			albumSavePromise.then(function(album){
				return album;
			}).catch(function(reason){
				console.error(reason);
			});

			albumPromises.push(albumSavePromise);
		}

		return Promise.all(albumPromises).then(results => {
			return results;
		}).catch(function(reason){
			console.error(reason);
		});
	});

	//Tracks
	var trackPromise = albumPromise.then(function(albums){

		var promiseTracks = [];
		for (var i in albums)
		{
			var album = albums[i];
			var allTracks = music[artistKey].albums[album.nameKey].tracks;

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

				promiseTracks.push(track);
			}
		}

		return promiseTracks;

	}).then(function(tracks){
		var trackPromises = [];
		for (var i in tracks)
		{
			var track = tracks[i];
			var trackPromise = Track.findOneAndUpdate({'nameKey': track.nameKey}, track, {new: true, upsert: true}).exec();
			trackPromise.then(function(track){
				console.log('Saved ' + artist.name + ' - "' + track.name + '"');
			}).catch(function(reason){
				console.error(reason);
			});

			trackPromises.push(trackPromise);
		}

		return Promise.all(trackPromises).then(results => {
			console.log('Done saving tracks for ' + artistData.name);
		}).catch(function(reason){
			console.error(reason);
		});

	}).catch(function(reason){
		console.error(reason);
	});

	//Done!
	return Promise.all([artistPromise, albumPromise, trackPromise]).then(results => {
		console.log('Done saving all data for ' + artistData.name);
	}).catch(function(reason){
		console.error(reason);
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

	jsonFile.writeFileSync(cachePath, {"files": []});

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

			var artistNameKey = artistName.toLowerCase().replace(/ |\/|\(|\)|\'|\"|\?|\[|\]|\{|\}|\#|\|:,/g, '');

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
		console.log('Saving data');
		for (var artistKey in music)
		{
			var artistData = music[artistKey];null
			var artistId = null;

			var artist = {
				name: artistData.name,
				nameKey: artistData.nameKey,
				imagePath: artistData.imagePath
			};

			savePromises.push(saveArtist(artist, artistKey, artistData, music));
		}

		Promise.all(savePromises).then(values => {
			console.log('Done saving all data');
			res.status(200).json({
				success: true
			});
		});

	}).catch(function(reason){
		console.error(reason);
		throw reason;
	});
}

module.exports = router;
