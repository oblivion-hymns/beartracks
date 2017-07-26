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
	public genres: any[] = [];
	public degreeString: string = "";

	constructor(private userService: UserService,
				private playerService: PlayerService,
				private trackService: TrackService) {}

	ngOnInit()
	{
		this.trackService.loadGenres().subscribe(genres => {this.genres = genres; console.log(this.genres)});

		var player = this.playerService.player;
		var currentTrack = player.currentTrack;
		if (currentTrack)
		{
			player.homeGenre = currentTrack.genre;
			this.setDegree(player.degree);
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
				this.degreeString = 'Just ' + player.homeGenre;
				break;
			case 1:
				this.degreeString = 'Music like ' + player.homeGenre;
				break;
			case 2:
				this.degreeString = 'Music similar to ' + player.homeGenre;
				break;
			case 3:
				this.degreeString = 'Anything somewhat related to ' + player.homeGenre;
				break;
			case 4:
				this.degreeString = 'Everything like ' + player.homeGenre + ' and more';
				break;
			case 5:
				this.degreeString = "Pretty much everything";
				break;
			default:
				this.degreeString = 'Just ' + player.homeGenre;
				break
		}
		player.degree = value;
	}

	getRelatedGenres(genre)
	{
		var relatedGenres = [];

		for (let k = 0; k < this.genres.length; k++)
		{
			var genreMap = this.genres[k];
			if (genre == genreMap.name)
			{
				relatedGenres = relatedGenres.concat(genreMap.related);
			}
		}

		return relatedGenres;
	}

	getMixGenres()
	{
		var player = this.playerService.player;
		var genre = player.homeGenre;

		//If you are not including related genres
		if (player.degree == 0)
		{
			return genre;
		}
		else if (player.degree == 1)
		{
			return this.getRelatedGenres(genre).sort().join(', ');
		}

		//Include related genres
		var mixGenres = this.getRelatedGenres(genre);
		for (let i = 0; i < player.degree; i++)
		{
			var outsideMixGenres = [];
			for (let j = 0; j < mixGenres.length; j++)
			{
				var relatedGenres = this.getRelatedGenres(mixGenres[j]);
				outsideMixGenres = outsideMixGenres.concat(relatedGenres);
			}

			mixGenres = mixGenres.concat(outsideMixGenres);
		}

		//Clean up duplicates & sort
		var cleanedGenres = [];
		for (let i = 0; i < mixGenres.length; i++)
		{
			var potentialGenre = mixGenres[i];
			if (cleanedGenres.indexOf(potentialGenre) === -1)
			{
				cleanedGenres.push(potentialGenre);
			}
		}

		cleanedGenres = cleanedGenres.sort();

		return cleanedGenres.join(', ');
	}
}
