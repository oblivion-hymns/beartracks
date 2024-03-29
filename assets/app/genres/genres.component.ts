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
	public loading: boolean = true;
	public genres: string[] = [];

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
	 * @param number degree
	 */
	playMix(genre: string, degree: number)
	{
		var playerService = this.playerService;
		var player = playerService.player;
		player.homeGenre = genre;
		player.isRadio = true;
		player.degree = degree;
		player.playTrackInGenre(genre);
		player.openQueue();
	}
}
