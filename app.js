var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
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
var server = require('http').createServer(app);
var io = require('socket.io')(server);

//Listening port for socket.io. Server still accessed through 3000
server.listen(4000);

io.sockets.on('connection', function(client){

	//Client joins rooms
	client.on('join', function(username){
		var botUsername = 'Jukebot';
		var bodyText = username + ' has joined the chat'
		var message = {
			text: bodyText,
			username: botUsername,
			dateTime: new Date(),
			system: true
		};
		io.emit('receiveMessage', message);
	});

	//Client queues a track
	client.on('enqueue', function(data){
		var track = data.track;
		var queue = data.queue;
		var queueLength = queue.length;

		if (queueLength > 0)
		{
			//just update queue
			queue.push(track);
			io.emit('updateQueue', queue);
		}
		else
		{
			//Enqueue and play
			io.emit('enqueueAndPlay', track);
		}
	});

	//Client sends a chat message
	client.on('sendMessage', function(message){
		message.dateTime = new Date();
		io.emit('receiveMessage', message);
	});
});

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

module.exports = app;
