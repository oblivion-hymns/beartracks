import { Component, ElementRef, Input, OnInit, NgZone } from '@angular/core';

import { Player } from './player';
import { PlayerService } from './player.service';

import { Track } from '../tracks/track';

@Component({
	providers: [PlayerService],
	selector: 'bt-player',
	styles: [``],
	templateUrl: './player.component.html'
})
export class PlayerComponent implements OnInit
{
	queue: Track[] = [];

	constructor(private playerService: PlayerService, private ngZone: NgZone){}

	ngOnInit() {}
}
