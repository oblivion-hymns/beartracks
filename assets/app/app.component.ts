import { Component } from '@angular/core';

import { PlayerService } from './player/player.service';
import { TrackService } from './tracks/track.service';
import { UserService } from './user/user.service';

@Component({
	providers: [PlayerService, TrackService],
	selector: 'my-app',
	styleUrls: ['./app.component.css'],
	templateUrl: './app.component.html'
})
export class AppComponent
{
	constructor(private userService: UserService,
				public playerService: PlayerService,
				private trackService: TrackService){}
}
