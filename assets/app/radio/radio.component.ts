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

		.radio-row
		{
			margin-top: 16px;
			text-align: left;
		}
	`],
	templateUrl: './radio.component.html'
})
export class RadioComponent implements OnInit
{
	public selectedGenre: string = null;
	public genres: string[] = [];
	public degreeString: string = "boring";

	constructor(private userService: UserService,
				private playerService: PlayerService,
				private trackService: TrackService) {}

	ngOnInit()
	{
		this.trackService.loadGenres().subscribe(genres => {this.genres = genres});

		var player = this.playerService.player;
		var currentTrack = player.currentTrack;
		if (currentTrack)
		{
			player.homeGenre = currentTrack.genre;
		}
	}

	/**
	 * Starts radio playback
	 */
	startRadio()
	{
		if (this.selectedGenre)
		{
			var player = this.playerService.player;
			player.homeGenre = this.selectedGenre;
			player.playTrackInGenre(player.homeGenre);
		}
	}

	onDegreeChange(event)
	{
		this.setDegree(event.value);
	}

	/**
	 * Sets the genre
	 */
	set setGenre(value)
	{
		this.selectedGenre = value || null;
	}

	isGenreSelected(name)
	{
		var player = this.playerService.player;
		var currentTrack = player.currentTrack;
		if (currentTrack)
		{
			return (player.homeGenre == name);
		}

		return false;
	}

	/**
	 * Sets the degree & its visual representation
	 */
	setDegree(value)
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
				this.degreeString = "ascended";
				break;
			default:
				this.degreeString = "boring";
				break;
		}
		this.playerService.player.degree = value;
	}
}
