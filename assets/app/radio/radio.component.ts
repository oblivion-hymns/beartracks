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
			color: rgba(255, 255, 255, 0.54);
			float: right;
			margin-top: 14px;
			padding-left: 16px;
			text-transform: lowercase;
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
	public degreeString: string = "";

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
			this.setDegree(player.degree);
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
		var player = this.playerService.player;

		switch (value)
		{
			case 0:
				this.degreeString = "I only want to hear " + player.homeGenre;
				break;
			case 1:
				this.degreeString = "I want music like " + player.homeGenre;
				break;
			case 2:
				this.degreeString = "I want music a bit like " + player.homeGenre;
				break;
			case 3:
				this.degreeString = "I want to feel adventurous";
				break;
			case 4:
				this.degreeString = "I want to be a musical pilgrim";
				break;
			case 5:
				this.degreeString = "I want to be patrician";
				break;
			default:
				this.degreeString = "I only want " + player.homeGenre;
				break
		}
		player.degree = value;
	}
}
