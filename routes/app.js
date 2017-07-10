var express = require('express');
var fs = require('fs');
var id3 = require('node-id3');
var id3js = require('id3js');
var mp3Duration = require('mp3-duration');
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
router.post('/update-lengths', determineLengths);

/**
 * Base route
 */
function baseRoute(req, res)
{
	res.render('index');
}

function determineLengths(req, res)
{
	var musicRoot = '/mnt/4432CB4E32CB4420/My Stuff/Music/A Winged Victory for the Sullen';
	//var musicRoot = '/mnt/4432CB4E32CB4420/My Stuff/Music';
	var files = recursiveReaddirSync(musicRoot);

	var cachePath = musicRoot + '/.bearcache-durations.json';
	if (!fs.existsSync(cachePath))
	{
		jsonFile.writeFileSync(cachePath, {"files": []});
	}

	jsonFile.writeFileSync(cachePath, {"files": []});

	var cache = jsonFile.readFileSync(cachePath);
	var totalFileCount = files.length;
	var runFilesParsed = 0;
	var currentFileCount = 0;
	var percentFileCount = 0;
	var filesToParse = 1000;
	var promises = [];

	for (var i in files)
	{
		var file = files[i];
		var encodedFilePath = encodeURIComponent(file).replace(/\W/g, '');

		var percentProgress = Math.floor((percentFileCount/totalFileCount) * 100);
		var progressString = '[' + percentProgress + '%]' + ' (' + percentFileCount + '/' + totalFileCount + ') ';
		var cached = cache.files.indexOf(encodedFilePath) != -1;

		if (!cached)
		{
			var fileType = path.extname(file);
			if (fileType == '.mp3')
			{
				var lengthAssignedPromise = assignTagLength(file, percentProgress, cache, cachePath, encodedFilePath);
				if (lengthAssignedPromise)
				{
					promises.push(lengthAssignedPromise);
					console.log(progressString + 'Writing length information to file ' + file);
				}
				else
				{
					console.log(progressString + 'Skipping file with length information.');
				}

				currentFileCount++;
				percentFileCount++;
			}
			else
			{
				console.log(progressString + 'Skipping non-audio file.');
				percentFileCount++;
			}
		}
		else
		{
			percentFileCount++;
			console.log(progressString + 'Skipping cached file.');
		}

		runFilesParsed++;

		if (currentFileCount >= filesToParse)
		{
			break;
		}
	}

	Promise.all(promises).then(function(results){
		if (currentFileCount >= filesToParse)
		{
			console.log('Syncing again...');
			determineLengths(req, res);
		}
		else
		{
			console.log('All done!');
			return res.status(200).json({success: true});
		}
	});
}

function assignTagLength(filePath, percentProgress, cache, cachePath, encodedFilePath)
{
	var readTags = null;
	try
	{
		readTags = id3.read(filePath);
	}
	catch (e)
	{
		console.error('Could not successfully read id3 tags for ' + filePath + '!');
		return;
	}

	var percentProgressString = '[' + percentProgress + '%] ';





	//if (!readTags.length) @TODO
	if (readTags.length)
	{
		lengthPromise = getDuration(filePath, readTags, cachePath, cache);
		return lengthPromise;
	}
	else
	{
		cache.files.push(encodedFilePath);
		jsonFile.writeFileSync(cachePath, cache);
	}





}

function getDuration(filePath, readTags, cachePath, cache)
{
	return new Promise(function(resolve, reject){
		mp3Duration(filePath, function(error, duration){
			if (error)
			{
				reject();
				console.error(error);
				throw error;
			}

			duration = parseInt(duration);

			readTags.length = duration;
			id3.write(readTags, filePath);
			cache.files.push();
			jsonFile.writeFileSync(cachePath, cache);
			console.log('Finished writing data for file ' + filePath);
			resolve();
		});
	});

}

/**
 * Parse ID3 tags for a given file
 */
function parseTags(filePath, allData, cache, cachePath)
{
	var tags = id3.read(filePath);
	if (!tags.artist || tags.artist == '')
	{
		console.error("Artist tag not found: " + filePath);
		return false;
	}
	else if (!tags.trackNumber)
	{
		console.error('Track number tag not found: ' + filePath);
		return false;
	}
	else if (!tags.genre)
	{
		console.error('Genre tag not found: ' + filePath);
		return false;
	}
	else if (!tags.partOfSet || tags.partOfSet == 0)
	{
		console.error("Discnum tag not found: " + filePath);
		return false;
	}
	else if (!tags.year || tags.year == '0000' || tags.year == '')
	{
		console.error("Year tag not found: " + filePath);
		return false;
	}
	else if (!tags.length)
	{
		console.error('Could not find track length for ' + filePath);
		return false;
	}

	allData.push({
		path: filePath,
		tags: tags
	});

	var fileKey = encodeURIComponent(filePath).replace(/\W/g, '');
	cache.files.push(fileKey);

	return true;
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
			console.error('Could not find track length for ' + track.originalPath);
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
	console.log('Syncing...');

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

	//Manage artists
	var pathLookup = {};
	var promises = [];

	var cache = null;
	cache = jsonFile.readFileSync(cachePath);

	var numFilesToSync = 50;
	var percentageFileCount = 0;
	var currentFileCount = 0;
	var totalFileCount = files.length;

	for (var i in files)
	{
		var file = files[i];
		var fileType = path.extname(file);

		var fileKey = encodeURIComponent(file).replace(/\W/g, '');
		var cached = cache.files.indexOf(fileKey) != -1;
		if (!cached)
		{
			var isAlbumArt = false;
			var isArtistArt = false;
			var isSong = false;
			var filePath = file;
			var tags = null;

			if (fileType == '.mp3')
			{
				var percentProgress = Math.floor((percentageFileCount/totalFileCount) * 100);
				console.log('[' + percentProgress + '%] Parsing ' + filePath);
				if (percentProgress >= 100)
				{
					complete = true;
				}

				var parseSuccess = parseTags(filePath, allData, cache, cachePath);
				if (parseSuccess)
				{
					currentFileCount++;
				}
			}

			percentageFileCount++;
		}
		else
		{
			//console.log('Skipped ' + file);
			percentageFileCount++;
		}

		if (currentFileCount >= numFilesToSync)
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

			var artistNameKey = artistName.toLowerCase().replace(/\W/g, '');
			artistNameKey = artistNameKey.replace(/\0/g, '').substring(0, 100);

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
			var albumNameKey = artistNameKey + albumName.toLowerCase().replace(/\W/g, '') + year;
			albumNameKey = albumNameKey.replace(/\0/g, '').substring(0, 100);
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
			var trackNum = tags.trackNumber.replace(/\0/g, '');
			var length = tags.length;
			var genre = tags.genre.replace(/\0/g, '');
			var discNum = tags.partOfSet.replace(/\0/g, '');

			if (!discNum || discNum == 0)
			{
				console.log('Could not find disc num for ' + artistNameKey + ' - "' + trackName + '"');
			}

			var trackNameStripped = trackName.toLowerCase().replace(/ |\/|\(|\)|\'|\"|\?|\[|\]|\{|\}|\#|\,/g, '');
			var trackNameKey = artistNameKey + albumNameKey + trackNameStripped + discNum + trackNum;
			trackNameKey = trackNameKey.substring(0, 100);

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

			console.log('Writing to cache');
			jsonFile.writeFile(cachePath, cache, function(error, data){
				if (error)
				{
					console.error(error);
					throw error;
				}

				console.log('Wrote cache');

				if (currentFileCount < numFilesToSync)
				{
					console.log('Done!');
					return res.status(200).json({
						success: true
					});
				}
				else
				{
					console.log('Syncing again');
					return sync(req, res);
				}
			});

		}).catch(function(reason){
			console.error(reason);
			throw reason;
		});

	}).catch(function(reason){
		console.error(reason);
		throw reason;
	});
}

module.exports = router;
