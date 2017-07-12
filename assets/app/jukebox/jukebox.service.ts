import 'rxjs/Rx';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { Album } from './../albums/album';
import { AlbumService } from './../albums/album.service';
import { Artist } from './../artists/artist';
import { ArtistService } from './../artists/artist.service';
import { Track } from './../tracks/track';
import { TrackService } from './../tracks/track.service';
import { Message } from './message';
import * as io from 'socket.io-client';

@Injectable()
export class JukeboxService {
	public queue: Track[] = [];
	public displayQueue: Track[] = [];
	private audio;
	public volume: number = 0.5;

	public elapsedInterval;
	public elapsed = '0:00';
	public elapsedPercent = 0;

	private socket;
	messages: Message[] = [];

	constructor(private http: Http)
	{
		//Initialize w/recent chat messages
		this.loadRecent();
		this.initSockets();
	}

	initSockets()
	{
		var self = this;
		this.socket = io('http://bwilbur.com:4000');

		//Get new chat messages emitted from server
		this.socket.on('receiveMessage', function(receivedMessage){
			var message = new Message(receivedMessage.text, receivedMessage.username, receivedMessage.dateTime, receivedMessage.system);
			self.messages.push(message);
		});

		this.socket.on('initializeQueue', function(receivedData){
			self.queue = receivedData.queue;
			self.displayQueue = self.queue.slice();
			self.displayQueue.shift();
			var elapsed = receivedData.elapsed;

			console.log('queue initialized');
		})

		this.socket.on('updateQueue', function(queue){
			self.queue = queue;
			self.displayQueue = self.queue.slice();
			self.displayQueue.shift();

			console.log('queue updated', self.queue);
		});

		this.socket.on('enqueueAndPlay', function(track){
			self.queue = [track];
			self.displayQueue = [];

			console.log('enqueue and play', self.queue);
		});
	}

	/**
	 * When a user enqueues a track
	 */
	enqueue(track)
	{
		this.socket.emit('enqueue', {track: track, queue: this.queue});
	}

	/**
	 * Set volume on player
	 */
	setVolume(value)
	{
		this.volume = value/100;
		this.audio.volume = this.volume;
	}

	/*getElapsed()
	{
		if (this.currentTrack)
		{
			var tempLength = parseInt(this.audio.currentTime);
			var length_h = 0;
			var length_m;
			var length_s;

			//Hours
			while (tempLength >= 3600)
			{
				length_h += 1;
				tempLength -= 3600;
			}

			//Minutes
			length_m = 0;
			while (tempLength >= 60)
			{
				length_m += 1;
				tempLength -= 60;
			}
			if (length_m == 0)
			{
				length_m = '0';
			}
			else if (length_m < 10 && length_h > 0)
			{
				length_m = '0' + length_m;
			}

			length_s = tempLength;
			if (length_s < 10)
			{
				length_s = '0' + length_s;
			}

			var elapsed = '';
			if (length_h > 0)
			{
				elapsed = '' + length_h + ':' + length_m + ':' + length_s;
			}
			else
			{
				elapsed = '' + length_m + ':' + length_s;
			}

			this.elapsed = elapsed;
		}
		else
		{
			this.elapsed = '0:00';
		}
	}

	getElapsedPercent()
	{
		if (this.currentTrack)
		{
			this.elapsedPercent = (this.audio.currentTime / parseInt(this.currentTrack.length)) * 100;
		}
		else
		{
			this.elapsedPercent = 0;
		}

		if (this.elapsedPercent >= 100)
		{
			this.elapsedPercent = 0;
			this.elapsed = '0:00';
			if (this.queue[this.queuePosition] + 1)
			{
				this.playPosition(this.queuePosition + 1);
			}
			else
			{
				this.pause();
			}
		}
	}*/




	/**
	 * Join room
	 */
	join(username)
	{
		this.socket.emit('join', username);
	}

	/**
	 * Load recent chat messages (on initial load)
	 */
	loadRecent()
	{
		var request = this.http.get('http://bwilbur.com/jukebox/load-recent').map((response: Response) => {
			const data = response.json().messages;
			let messages: Message[] = [];
			for (let messageData of data)
			{
				var message = new Message(messageData.text, messageData.username, messageData.dateTime, false);
				messages.push(message);
			}

			this.messages = messages;
		});

		request.subscribe(function(messages) {
			this.messages = messages;
		});
	}

	/**
	 * Send chat message to server
	 */
	postMessage(msg: Message)
	{
		var url = 'http://bwilbur.com:3000/jukebox/send-message';
		var body = { message: msg.text, username: msg.username };
		var headers = new Headers({'Content-Type': 'application/json'});
		var options = new RequestOptions({headers: headers});
		this.http.post(url, body, options).map((res:Response) => res.json()).subscribe();

		this.socket.emit('sendMessage', msg);
	}
}
