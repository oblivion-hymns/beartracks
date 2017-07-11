import 'rxjs/Rx';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { JukeboxService } from './jukebox.service';

@Component({
	providers: [JukeboxService],
	selector: 'bt-jukebox',
	styles: [``],
	templateUrl: './jukebox.component.html'
})
export class JukeboxComponent
{
	@Input() message: string = '';
	username: string = '' + (Math.random() * (1000000 - 0) + 0);

	constructor(private jukeboxService: JukeboxService) {}

	set setMessage(value)
	{
		this.message = value;
	}

	/**
	 * Sends the provided message
	 */
	sendMessage()
	{
		this.message = this.message.trim();
		if (this.message.length > 0)
		{
			this.jukeboxService.postMessage(this.message);
			this.message = '';
		}

	}
}
