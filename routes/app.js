var express = require('express');
var fs = require('fs');
var id3 = require('node-id3');
var recursiveReaddirSync = require('recursive-readdir-sync');
var path = require ('path');

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

	var musicRoot = '/mnt/4432CB4E32CB4420/My Stuff/Music';
	var files = recursiveReaddirSync(musicRoot);
	var data = [];

	//Prune for artists
	for (var i in files)
	{
		var file = files[i];
		var fileType = path.extname(file);

		var path = file;
		var tags = null;
		var isSong = false;
		var isAlbumArt = false;
		var isArtistArt = false;

		if (fileType == '.mp3')
		{
			tags = id3.read(file);
			isSong = true;
			isAlbumArt = false;
			isArtistArt = false;
		}

		data.push({
			path: file,
			tags: tags,
			isSong: isSong,
			isAlbumArt: isAlbumArt,
			isArtistArt: isArtistArt
		});
	}

	/*recursiveReaddir(musicRoot, function(err, fileList){


		for (var i in files)
		{
			var file = files[i];
			var fileType = path.extname(file);

			switch (fileType)
			{
				case '.mp3':
					var tags = id3.read(file);
					var artist = tags.artist;
					var album = tags.album;
					var year = tags.year;
					var genre = tags.genre;
					var trackNum = tags.trackNumber;
					var trackTitle = tags.title;

					if (!trackNum || trackNum == '')
					{
						console.error('Error loading ' + artist + '- "' + trackTitle + '": No track num found');
					}

					//Determine disc number
					var discNum = 1;
					var dirName = path.dirname(file).split('/').pop();
					if (dirName.match(/^Disc d+$/))
					{
						var matches = str.match(/\d+$/);
						if (matches)
						{
							discNum = matches[0];
							console.log("Disc number " + discNum);
						}
					}

					//Manage artist
					var artistKey = tags.artist.toLowerCase().replace(' ', '');
					var albumKey = artistKey + album.toLowerCase().replace(' ', '') + year;
					var songKey = artistKey + albumKey + trackTitle.toLowerCase().replace(' ', '') + trackNum;

					lastArtistObj = artistObj;
					lastAlbumObj = albumObj;

					break;
				case '.png':
					break;
				default:
					break;
			}
		}
	});*/



	//Iterate through all of the lowest level files
	//	Get artist image and save on the way down
	//	Get all metadata and organize appropriately
	//		Check if artist exists (name key)
	//		Check if albums exist (by name + year)
	//		Check if tracks exist (by name)


	/*fs.readdir(musicRoot, (err, files) => {
		files.forEach(file => {
			var dirName = file;
			var fullPath = musicRoot + '/' + dirName;
			var imgPath = fullPath + '/artist.png';

			fs.stat(imgPath, function(err, stat){
				var artist = new Artist();
				artist.name = dirName;
				artist.nameKey = dirName.toLowerCase();

				if (err == null)
				{
					var newPath = __dirname + '/../public/img/artists/' + artist.name + '.png';
					fs.createReadStream(imgPath).pipe(fs.createWriteStream(newPath));

					nameEscaped = artist.name.replace(new RegExp(' ', 'g'), '%20');
					artist.imagePath = '/img/artists/' + nameEscaped + '.png';
				}

				console.log("Found " + artist.name);
				artist.save();
			});
		});
	});*/

	res.render('index');
}

module.exports = router;
