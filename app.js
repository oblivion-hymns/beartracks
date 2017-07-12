var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var io = require('socket.io');
var mongoose = require('mongoose');
var path = require('path');
var timeout = require('connect-timeout');

var appRoutes = require('./routes/app');
var artistRoutes = require('./routes/artists');
var albumRoutes = require('./routes/albums');
var trackRoutes = require('./routes/tracks');
var jukeboxRoutes = require('./routes/jukebox');

mongoose.connect('localhost:27017/beartracks');

var app = express();
app.timeout = 60000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(timeout('57600s'));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
	next();
});

app.use('/tracks', trackRoutes);
app.use('/artists', artistRoutes);
app.use('/albums', albumRoutes);
app.use('/jukebox', jukeboxRoutes);
app.use('/', appRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	return res.render('index');
});

var socket = io.listen(3000);
socket.on('connection', function(socket){
	console.log('aye, connection');
});


module.exports = app;
