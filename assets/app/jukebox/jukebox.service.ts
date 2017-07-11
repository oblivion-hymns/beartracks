import 'rxjs/Rx';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class JukeboxService {

	constructor(private http: Http) {}

	postMessage(msg: string)
	{
		var url = 'http://bwilbur.com:3000/messages/send';
		var body = {
			message: msg
		};
		var headers = new Headers({'Content-Type': 'application/json'});
		var options = new RequestOptions({headers: headers});
		var response;

		this.http.post(url, body, options).map((res:Response) => res.json()).subscribe();
	}

	/*getMessage()
	{
		return this.socket.fromEvent("message").map(data => data.msg);
	}*/
}
