import { Component, Input, OnInit, NgZone } from '@angular/core';

import { Artist } from './artist';
import { ArtistService } from './artist.service';

@Component({
	providers: [ArtistService],
	selector: 'bt-artists',
	styles: [`
		#ArtistsToolbar {
			background-color: rgba(0, 0, 0, 0.54);
			border-radius: 3px;
			padding: 12px;
			position: fixed;
			right: 0px;
			top: 96px;
			z-index: 5;
		}

		#FilterArtists input {
			color: rgba(255, 255, 255, 0.54);
		}

		.artist-name
		{
			display: inline-block;
			margin-bottom: 2px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			max-width: 100%;
			width: 100%;
		}
	`],
	templateUrl: './artists.component.html'
})
export class ArtistsComponent implements OnInit {
	artists: Artist[] = [];
	displayArtists: Artist[] = [];

	@Input() filterQuery = '';

	constructor(private artistService: ArtistService, private ngZone: NgZone) {}

	ngOnInit()
	{
		this.artistService.loadAll().subscribe(
			(artists: Artist[]) => {
				this.artists = artists;
				this.displayArtists = [];
			}
		)
	}

	set filterString(value)
	{
		//Reset list
		this.displayArtists = [];

		if (value && value.length > 2)
		{
			value = value.toLowerCase().replace(/\W/g, '');
			this.displayArtists = this.artists.filter(
				artist => artist.nameKey.includes(value));
		}

		this.filterQuery = value;
	}

	filterArtists(query)
	{
		this.filterQuery = query;
	}
}
