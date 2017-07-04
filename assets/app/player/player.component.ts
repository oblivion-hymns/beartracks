import { Component, ElementRef, Input, OnInit, NgZone } from '@angular/core';

import { PlayerService } from './player.service';

@Component({
	selector: 'bt-player',
	styleUrls: ['./player.component.css'],
	templateUrl: './player.component.html'
})
export class PlayerComponent implements OnInit
{
	constructor(private playerService: PlayerService){}

	ngOnInit()
	{
	}
}
