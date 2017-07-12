import 'rxjs/Rx';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Message } from './message';
import * as io from 'socket.io-client';

@Injectable()
export class JukeboxService {

	private socket: SocketIOClient.Socket;

	constructor(private http: Http)
	{
		console.log('Jukebox service constructor');
		var socket = io.connect('http://localhost:3000');
		socket.on('connect', function(){
			console.log('lol wut?');
		});
	}

	sendSocketMessage(msg: string)
	{
		//this.socket.emit('sendMessage', msg);
	}

	getSocketMessage()
	{
		//return this.socket.on('sendMessage', );
	}

	loadRecent()
	{
		return this.http.get('http://bwilbur.com/jukebox/load-recent')
			.map((response: Response) => {
				const data = response.json().messages;
				let messages: Message[] = [];
				for (let messageData of data)
				{
					var message = new Message(messageData.text, messageData.username, messageData.dateTime);
					messages.push(message);
				}

				return messages;
			})
			.catch((error: Response) => Observable.throw(error.json()));
	}

	postMessage(msg: Message)
	{
		var url = 'http://bwilbur.com:3000/jukebox/send-message';
		var body = { message: msg.text, username: msg.username };
		var headers = new Headers({'Content-Type': 'application/json'});
		var options = new RequestOptions({headers: headers});
		this.http.post(url, body, options).map((res:Response) => res.json()).subscribe();
	}

	/*getMessage()
	{
		return this.socket.fromEvent("message").map(data => data.msg);
	}*/
}
