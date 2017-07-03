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
			font-weight: bold;
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

	screenWidth: number;
	@Input() filterQuery = '';

	zoomLevels = [
		{scale: 4},
		{scale: 5},
		{scale: 6},
		{scale: 7},
		{scale: 8}
	];
	zoomIndex = 0;

	constructor(private artistService: ArtistService, private ngZone: NgZone) {
		window.onresize = (e) =>
		{
			this.ngZone.run(() => {
				this.screenWidth = window.innerWidth;
			});
		};

		this.screenWidth = window.innerWidth;
	}

	ngOnInit()
	{
		this.screenWidth = window.innerWidth;
		this.artistService.loadAll().subscribe(
			(artists: Artist[]) => {
				this.artists = artists;
				this.displayArtists = artists.slice();
				console.log(artists);
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
