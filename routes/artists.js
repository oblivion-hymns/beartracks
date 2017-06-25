var express = require('express');
var fs = require('fs');

var Artist = require('../models/artist');

var router = express.Router();

router.get('/', function(req, res, next){
	res.render('index');
});

router.get('/all', function(req, res, next){
	Artist.find({})
		.sort('nameKey')
		.exec(function(err, artists){
			if (err)
			{
				return res.status(500).json({
					title: 'An error occurred',
					error: err
				});
			}

			res.status(200).json({
				message: 'Success',
				obj: artists
			});
		});
});

router.get('/sync', function(req, res, next){
	Artist.remove({}, function(){});

	var musicRoot = '/mnt/4432CB4E32CB4420/My Stuff/Music';

	fs.readdir(musicRoot, (err, files) => {
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
	});

	res.render('index');
});

module.exports = router;
