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
	queue: Track[] = [];
	private socket;
	messages: Message[] = [];

	constructor(private http: Http)
	{
		//Initialize w/recent chat messages
		this.loadRecent();

		var self = this;
		this.socket = io('http://bwilbur.com:4000');
		this.socket.on('receiveMessage', function(receivedMessage){
			var message = new Message(receivedMessage.text, receivedMessage.username, receivedMessage.dateTime, receivedMessage.system);
			self.messages.push(message);
		});

		this.socket.on('receiveQueue', function(receivedQueue){
			this.queue = receivedQueue;
		});
	}

	join(username)
	{
		this.socket.emit('join', username);
	}

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
