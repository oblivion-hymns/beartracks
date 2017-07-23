import { Component } from '@angular/core';

import { UserService } from './../user/user.service';
import { PlayerService } from './../player/player.service';

@Component({
	providers: [UserService],
	selector: 'bt-radio',
	styles: [``],
	templateUrl: './radio.component.html'
})
export class RadioComponent
{
	constructor(private playerService: PlayerService, private userService: UserService) {}
}
