import { Component, Input } from '@angular/core';

import { PlayerService } from './player.service';
import { Album } from './../albums/album';
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
	public theaterMode: boolean = false;

	constructor(private playerService: PlayerService, private trackService: TrackService){}

	/**
	 * Volume changes as the slider is increased/decreased -- not just when you release
	 */
	onVolumeChange(event)
	{
		this.playerService.player.setVolume(event.value);
	}

	/**
	 * Adds a totally random song
	 */
	surpriseMe()
	{
		this.trackService.loadRandom().subscribe((track: Track[]) => {
			this.playerService.player.enqueueOne(track);
		});
	}

	/**
	 * Enables theater mode
	 */
	enableTheater()
	{
		this.theaterMode = true;
	}

	/**
	 * Disables theater mode
	 */
	disableTheater()
	{
		this.theaterMode = false;
	}

	/**
	 * Convenience method to return the player
	 */
	getPlayer()
	{
		return this.playerService.player;
	}

	/**
	 * Convenience method to return the current track
	 */
	getCurrentTrack()
	{
		return this.playerService.player.currentTrack;
	}
}
