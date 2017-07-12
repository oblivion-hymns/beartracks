import 'rxjs/Rx';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Message } from './message';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class JukeboxService {

	constructor(private http: Http, private socket: Socket)
	{
		console.log('Jukebox service constructor');
		this.socket.emit('sendMessage', 'hello world!');
	}

	sendSocketMessage(msg: string)
	{

	}

	getSocketMessage()
	{

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
