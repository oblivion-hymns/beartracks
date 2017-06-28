var express = require('express');
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
}

module.exports = router;
