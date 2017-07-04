import { Component, ElementRef, Input, OnInit, NgZone } from '@angular/core';

import { PlayerService } from './player.service';
import { TrackService } from '../tracks/track.service';

@Component({
	providers: [TrackService],
	selector: 'bt-player',
	styleUrls: ['./player.component.css'],
	templateUrl: './player.component.html'
})
export class PlayerComponent implements OnInit
{
	constructor(private playerService: PlayerService, private trackService: TrackService){}

	ngOnInit() {
	}
}
