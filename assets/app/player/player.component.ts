import { Component, Input } from '@angular/core';
import { Lightbox } from 'angular2-lightbox';

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
	constructor(private playerService: PlayerService, private trackService: TrackService, private _lightbox: Lightbox){}

	onVolumeChange(event)
	{
		this.playerService.player.setVolume(event.value);
	}

	surpriseMe()
	{
		this.trackService.loadRandom().subscribe((track: Track[]) => {
			this.playerService.player.enqueueOne(track);
		});
	}

	/**
	 * Opens a pretty lightbox with the given album's art inside it
	 */
	openLightbox(album: Album)
	{
		var albums = [
			{
				caption: album.artist.name + ' - "' + album.name + '" (' + album.year + ')',
				src: album.imagePath,
				thumb: album.imagePath
			}
		];

		this._lightbox.open(albums, 0);
	}
}
