import { Component } from '@angular/core';
import { PlayerService } from './../player/player.service';
import { TrackService } from './../tracks/track.service';

@Component({
	providers: [TrackService],
	selector: 'bt-genres',
	styles: [`
		.item-column
		{
			 margin-left: 33%;
			 padding: 16px;
			 width: 34%;
		}

		.item-column-body
		{
			height: calc(100% - 73px);
			max-height: 100%;
			overflow-y: auto;
		}

	`],
	templateUrl: './genres.component.html'
})
export class GenresComponent
{
	private loading: boolean = false;
	private genres: string[] = [];

	constructor(private playerService: PlayerService, private trackService: TrackService)
	{
		this.trackService.loadGenres().subscribe(genres => {
			this.loading = false;
			this.genres = genres;
		});
	}

	/**
	 * Begins a mix using the given genre
	 * @param string genre
	 */
	playMix(genre: string)
	{
		var playerService = this.playerService;
		var player = playerService.player;
		player.homeGenre = genre;
		player.isRadio = true;
		player.degree = 1;
		player.playTrackInGenre(genre);
		player.openQueue();
	}
}
