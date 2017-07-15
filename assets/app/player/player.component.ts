import { Component, Input } from '@angular/core';

import { PlayerService } from './player.service';
import { Track } from './../tracks/track';
import { TrackService } from '../tracks/track.service';

@Component({
	providers: [TrackService],
	selector: 'bt-player',
	styleUrls: ['./player.component.css'],
	templateUrl: './player.component.html'
})
export class PlayerComponent
{
	constructor(private playerService: PlayerService, private trackService: TrackService){}

	set volume(value)
	{
		this.playerService.player.setVolume(value);
	}

	surpriseMe()
	{
		this.trackService.loadRandom().subscribe((track: Track[]) => {
			this.playerService.player.enqueueOne(track);
		});
	}
}
