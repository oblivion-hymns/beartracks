import { Component, Input, OnInit } from '@angular/core';

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
	`],
	templateUrl: './artists.component.html'
})
export class ArtistsComponent implements OnInit {
	artists: Artist[] = [];
	displayArtists: Artist[] = [];

	@Input() filterQuery = '';

	zoomLevels = [
		{scale: 2, height: 512},
		{scale: 3, height: 384},
		{scale: 4, height: 256},
		{scale: 5, height: 224},
		{scale: 6, height: 192},
		{scale: 7, height: 160},
		{scale: 8, height: 128}
	];
	zoomIndex = 2;

	constructor(private artistService: ArtistService) {}

	ngOnInit()
	{
		this.artistService.loadAll().subscribe(
			(artists: Artist[]) => {
				this.artists = artists;
				this.displayArtists = artists.slice();
			}
		)
	}

	set filterString(value)
	{
		//Reset list
		this.displayArtists = this.artists.slice();

		if (value)
		{
			value = value.toLowerCase();
			this.displayArtists = this.displayArtists.filter(
				artist => artist.nameKey.includes(value));
		}
	}

	filterArtists(query)
	{
		this.filterQuery = query;
	}

	zoomOut()
	{
		if (this.zoomIndex < this.zoomLevels.length-1)
		{
			this.zoomIndex += 1;
		}
	}

	zoomIn()
	{
		if (this.zoomIndex > 0)
		{
			this.zoomIndex -= 1;
		}
	}
}
