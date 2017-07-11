import 'rxjs/Rx';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { JukeboxService } from './jukebox.service';
import { Message } from './message';

@Component({
	providers: [JukeboxService],
	selector: 'bt-jukebox',
	styles: [``],
	templateUrl: './jukebox.component.html'
})
export class JukeboxComponent implements OnInit
{
	@Input() message: string = '';
	username: string = 'User ' + (Math.floor(Math.random() * (1000000 - 0) + 0));

	messages: Message[] = [];

	constructor(private jukeboxService: JukeboxService) {}

	ngOnInit()
	{
		this.jukeboxService.loadRecent().subscribe(
			(messages: Message[]) => { this.messages = messages; });
	}

	set setMessage(value)
	{
		this.message = value;
	}

	get setMessage()
	{
		return this.message;
	}

	/**
	 * Sends the provided message
	 */
	sendMessage()
	{
		this.message = this.message.trim();
		if (this.message.length > 0)
		{
			var message = new Message(this.message, this.username);
			this.jukeboxService.postMessage(message);
			this.message = '';
		}

	}
}
