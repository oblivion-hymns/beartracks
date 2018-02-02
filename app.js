var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var timeout = require('connect-timeout');

var albumRoutes = require('./routes/albums');
var appRoutes = require('./routes/app');
var artistRoutes = require('./routes/artists');
var trackRoutes = require('./routes/tracks');
var userRoutes = require('./routes/user');

var Message = require('./models/message');
var UserLookupSchema = require('./models/userlookup');

mongoose.connect('mongodb://localhost:27017/beartracks', {
	'useMongoClient': true,
	"auth": {
		"authSource": "admin"
	},
	'user': 'brian',
	'pass': 'turtlecup!'
});

var appPort = 3000;

var app = express();
app.listen(appPort, function(){
	console.log(`Listening on port ${appPort}...`);
});

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
	next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(timeout('57600s'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', userRoutes);
app.use('/albums', albumRoutes);
app.use('/artists', artistRoutes);
app.use('/tracks', trackRoutes);
app.use('/', appRoutes);

// catch 404 and forward to error handler
app.use(function (req, res) {
	return res.render('index');
});

module.exports = app;
