import { Component, OnInit } from '@angular/core';

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
			position: absolute;
			right: 0px;
			top: 96px;
			z-index: 5;
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

	zoomLevels = [
		{scale: 2, height: 512},
		{scale: 4, height: 256},
		{scale: 8, height: 128},
		{scale: 16, height: 64}
	];
	zoomIndex = 1;

	constructor(private artistService: ArtistService) {}

	ngOnInit() {
		this.artistService.loadAll().subscribe(
			(artists: Artist[]) => {
				this.artists = artists;
			}
		)
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
