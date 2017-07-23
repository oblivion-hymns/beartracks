import { Component, OnInit } from '@angular/core';

import { PlayerService } from './../player/player.service';
import { TrackService } from './../tracks/track.service';
import { UserService } from './../user/user.service';

@Component({
	providers: [TrackService, UserService],
	selector: 'bt-radio',
	styles: [`
		md-slider
		{
			width: 100%;
		}

		.degree-slider
		{
			float: left; width: 50%;
		}

		.degree-text
		{
			box-sizing: border-box;
			float: right;
			margin-top: 14px;
			padding-left: 16px;
			width: 50%;
		}

		.radio-container
		{
			margin-top: 32px;
		}
	`],
	templateUrl: './radio.component.html'
})
export class RadioComponent implements OnInit
{
	public genre: string = null;
	public genres: string[] = [];
	public degreeString: string = "Not adventurous";

	constructor(private userService: UserService,
				private playerService: PlayerService,
				private trackService: TrackService) {}

	ngOnInit()
	{
		this.trackService.loadGenres().subscribe(genres => {this.genres = genres});
	}

	/**
	 * Starts radio playback
	 */
	startRadio()
	{
		this.playerService.player.playTrackInGenre(this.genre);
	}

	/**
	 * Sets the genre
	 */
	set setGenre(value)
	{
		console.log(value);
		this.genre = value || null;
	}

	/**
	 * Sets the degree & its visual representation
	 */
	set setDegree(value)
	{
		switch (value)
		{
			case 0:
				this.degreeString = "boring";
				break;
			case 1:
				this.degreeString = "curious";
				break;
			case 2:
				this.degreeString = "adventurous";
				break;
			case 3:
				this.degreeString = "more adventurous";
				break;
			case 4:
				this.degreeString = "patrician";
				break;
			case 5:
				this.degreeString = "indiana jones";
				break;
			default:
				this.degreeString = "not adventurous";
				break;
		}
		this.playerService.player.degree = value;
	}
}
