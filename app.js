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

mongoose.connect('localhost:27017/beartracks');

var app = express();
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
	next();
});

var server = require('http').createServer(app);
var io = require('socket.io')(server);

//Listening port for socket.io. Server still accessed through 3000
server.listen(4000);

io.sockets.on('connection', function(client){

	//Client joins rooms
	client.on('join', function(username){
		console.log(client.id + ' connected');
		var lookup = new UserLookupSchema({
			username: username,
			clientId: client.id
		});
		lookup.save({});

		var botUsername = 'Jukebot';
		var bodyText = username + ' has joined the chat';
		var message = new Message({
			text: bodyText,
			username: botUsername,
			dateTime: new Date(),
			system: true
		});
		message.save({});
		io.emit('receiveMessage', message);

		//If there's someone else in the room, try to get the current state of the queue
		var allClients = Object.keys(io.sockets.sockets);
		if (allClients.length > 1)
		{
			for (var i in allClients)
			{
				var clientId = allClients[i];
				if (clientId != client.id)
				{
					io.to(clientId).emit('getCurrentQueueState', {socketId: client.id});
				}
			}
		}

		io.emit('updateChatMembers', allClients.length);
	});

	client.on('getCurrentQueueState', function(){
		//If there's someone else in the room, try to get the current state of the queue
		var allClients = Object.keys(io.sockets.sockets);
		if (allClients.length > 1)
		{
			for (var i in allClients)
			{
				var clientId = allClients[i];
				if (clientId != client.id)
				{
					io.to(clientId).emit('getCurrentQueueState', {socketId: client.id});
				}
			}
		}

		io.emit('updateChatMembers', allClients.length);
	});

	client.on('sendCurrentQueueState', function(data){
		var queue = data.queue;
		var elapsed = data.elapsed;
		var socketId = data.socketId;
		var returnData = {queue: queue, elapsed: elapsed};
		io.to(socketId).emit('initializeQueue', returnData);
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

	client.on('songEnded', function(queue){
		//Song is done, broadcast the new queue back
		queue.shift();
		io.emit('updateQueueAndPlay', queue);
	});

	//Client sends a chat message
	client.on('sendMessage', function(message){
		message.dateTime = new Date();
		io.emit('receiveMessage', message);
	});

	client.on('disconnect', function(){
		console.log(client.id + ' disconnected');
		UserLookupSchema.find({'clientId': client.id}, function(error, docs){
			if (error)
			{
				console.error(error);
			}

			if (docs.length > 0)
			{
				var botUsername = 'Jukebot';
				var username = docs[0].username;
				var bodyText = username + ' has left the chat';
				var message = new Message({
					text: bodyText,
					username: botUsername,
					dateTime: new Date(),
					system: true
				});
				message.save({});
				io.emit('receiveMessage', message);
			}

			UserLookupSchema.remove({'clientId': client.id}, function(error){
				if (error)
				{
					console.error(error);
				}
			});
		});

		var allClients = Object.keys(io.sockets.sockets);
		io.emit('updateChatMembers', allClients.length);
	});
});

app.timeout = 60000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(timeout('57600s'));
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
