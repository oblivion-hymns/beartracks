import 'rxjs/Rx';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { JukeboxService } from './jukebox.service';
import { Message } from './message';

@Component({
	providers: [JukeboxService],
	selector: 'bt-jukebox',
	styles: [`
		#JukeboxChat
		{
			background-color: rgba(0, 0, 0, 0.18);
			border-left: 1px solid rgba(0, 0, 0, 0.87);
			border-radius: 5px 0px 0px 0px;
			bottom: 137px;
			display: block;
			height: 35%;
			padding: 8px;
			position: absolute;
			right: 0px;
			width: 50%;
		}
	`],
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
