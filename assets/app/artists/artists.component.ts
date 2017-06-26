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

		#FilterArtists {

		}

		#FilterArtists input {
			color: rgba(255, 255, 255, 0.54);
		}

		.mat-input-ripple {
			background-color: rgba(255, 255, 255, 0.87);
		}

		md-grid-tile {
			background-repeat: no-repeat;
			background-position: center center;
			background-size: cover;
			opacity: 0.70;
			transition: .15s;
		}

		md-grid-tile:hover {
			cursor: pointer;
			opacity: 1.0;
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

	ngOnInit() {
		this.artistService.loadAll().subscribe(
			(artists: Artist[]) => {
				this.artists = artists;
				this.displayArtists = artists.slice();
			}
		)
	}

	set filterString(value) {
		//Reset list
		this.displayArtists = this.artists.slice();

		if (value)
		{
			value = value.toLowerCase().trim();

			if (value.length > 0)
			{
				this.displayArtists = this.displayArtists.filter(
					artist => artist.name.toLowerCase().trim().includes(value));
			}

			console.log(this.displayArtists, this.artists);
		}
	}

	filterArtists(query) {
		this.filterQuery = query;
		console.log(query);
	}

	zoomOut() {
		if (this.zoomIndex < this.zoomLevels.length-1)
		{
			this.zoomIndex += 1;
		}
	}

	zoomIn() {
		if (this.zoomIndex > 0)
		{
			this.zoomIndex -= 1;
		}
	}
}