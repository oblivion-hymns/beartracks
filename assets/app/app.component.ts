import { Component } from '@angular/core';
import { PlayerService } from './player/player.service';

//import { MessageService } from './messages/message.service';

@Component({
	providers: [PlayerService],
	selector: 'my-app',
	styleUrls: ['./app.component.css'],
	templateUrl: './app.component.html'
})
export class AppComponent
{
	constructor(private playerService: PlayerService){}
}
