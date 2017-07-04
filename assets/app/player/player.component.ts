import { Component, ElementRef, Input, OnInit, NgZone } from '@angular/core';

import { PlayerService } from './player.service';

@Component({
	selector: 'bt-player',
	styles: [`
		#Player
		{
			background-color: rgb(40, 40, 40);
			bottom: 0px;
			left: 0px;
			padding: 16px;
			position: fixed;
			width: 100%;
		}

		#Player .now-playing
		{

		}

		#Player img.now-playing-art
		{
			border: 1px solid rgba(0, 0, 0, 0.54);
			float: left;
			height: 96px;
			width: 96px;
		}

	`],
	templateUrl: './player.component.html'
})
export class PlayerComponent implements OnInit
{
	constructor(private playerService: PlayerService){}

	ngOnInit() {}
}
