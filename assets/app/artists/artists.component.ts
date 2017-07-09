import { Component, Input, OnInit } from '@angular/core';

import { Artist } from './artist';
import { ArtistService } from './artist.service';

@Component({
	providers: [ArtistService],
	selector: 'bt-artists',
	styles: [`
		#FilterArtists input {
			color: rgba(255, 255, 255, 0.54);
		}
	`],
	templateUrl: './artists.component.html'
})
export class ArtistsComponent implements OnInit {
	artists: Artist[] = [];
	displayArtists: Artist[] = [];

	@Input() filterQuery = '';

	constructor(private artistService: ArtistService) {}

	ngOnInit()
	{
		this.artistService.loadAll().subscribe(
			(artists: Artist[]) => { this.artists = artists; }
		)
	}

	set filterString(value)
	{
		this.displayArtists = [];

		value = value.trim();
		if (value == '*')
		{
			this.displayArtists = this.artists.filter(
				artist => artist.nameKey.includes(''));
		}
		else
		{
			var transformedValue = value.toLowerCase().replace(/\W/g, '');
			if (transformedValue.length > 2)
			{
				this.displayArtists = this.artists.filter(
					artist => artist.nameKey.includes(transformedValue));
			}
		}

		this.filterQuery = value;
	}

	filterArtists(query)
	{
		this.filterQuery = query;
	}
}
