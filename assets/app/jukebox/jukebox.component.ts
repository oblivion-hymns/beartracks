import 'rxjs/Rx';
import { AfterViewChecked, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { JukeboxService } from './jukebox.service';
import { Message } from './message';

@Component({
	providers: [JukeboxService],
	selector: 'bt-jukebox',
	styles: [`
		#JukeboxChat
		{
			background-color: rgb(40, 40, 40);
			border-left: 1px solid rgba(0, 0, 0, 0.87);
			border-radius: 5px 0px 0px 0px;
			bottom: 137px;
			display: block;
			height: 50%;
			padding: 8px;
			position: absolute;
			overflow-y: hidden;
			right: 0px;
			width: 50%;
		}

		#JukeboxChat #Messages
		{
			background-color: rgba(0, 0, 0, 0.38);
			border: 1px solid rgba(0, 0, 0, 0.38);
			border-radius: 2px;
			box-sizing: border-box;
			box-shadow: inset 1px 1px 2px 2px rgba(0, 0, 0, 0.20);
			height: 90%;
			overflow-y: scroll;
			padding: 0px;
		}

		#JukeboxChat #Messages .message-item
		{
			margin-bottom: 4px;
			padding: 12px;
		}

		#JukeboxChat #Messages .message-item:nth-child(odd)
		{
			background-color: rgba(0, 0, 0, 0.12);
		}

		#JukeboxChat #Messages .message-item.message-item-system
		{
			background-color: rgba(255, 255, 255, 0.1);
		}

		#JukeboxChat #Messages .message-item-username
		{
			color: rgba(255, 255, 255, 0.54);
		}

		#JukeboxChat #Messages .message-item-text
		{
			color: rgba(255, 255, 255, 0.87);
		}

		#JukeboxChat #Messages .message-item-date
		{
			color: rgba(255, 255, 255, 0.36);
			float: right;
			font-size: 12px;
		}

		#JukeboxChat #Send
		{
			height: 6%;
		}
	`],
	templateUrl: './jukebox.component.html'
})
export class JukeboxComponent implements OnInit, AfterViewChecked
{
	@Input() message: string = '';
	@ViewChild('chat') input;
	username: string = 'User ' + (Math.floor(Math.random() * (1000000 - 0) + 0));

	constructor(private jukeboxService: JukeboxService) {}

	ngOnInit()
	{
		this.jukeboxService.join(this.username);
	}

	ngAfterViewChecked()
	{
		this.scrollChat();
	}

	ngAfterViewInit()
	{
		this.input.nativeElement.scrollTop = 500;
	}

	set setMessage(value)
	{
		this.message = value;
	}

	get setMessage()
	{
		return this.message;
	}

	connectToSocket()
	{

	}

	scrollChat()
	{
		this.input.nativeElement.scrollTop = this.input.nativeElement.scrollHeight;
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

			message.dateTime = new Date();
		}
	}
}
