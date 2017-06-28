var express = require('express');
var fs = require('fs');
var id3 = require('node-id3');
var recursiveReaddir = require('recursive-readdir');
var path = require ('path');

var Artist = require('../models/artist');

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

function ignoreFunction(file, stats)
{
	return false;
}

/**
 * Syncs all music data
 */
function sync(req, res)
{
	Artist.remove({}, function(){});

	var musicRoot = '/mnt/4432CB4E32CB4420/My Stuff/Music';

	recursiveReaddir(musicRoot, [ignoreFunction], function(err, files){
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

					console.log('' + artist + ' - "' + trackTitle + '"');

					break;
				case '.png':
					break;
				default:
					break;
			}
		}
	});

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
