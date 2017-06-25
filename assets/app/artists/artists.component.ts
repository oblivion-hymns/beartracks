import { Component, OnInit } from '@angular/core';

import { Artist } from './artist';
import { ArtistService } from './artist.service';

@Component({
	providers: [ArtistService],
	selector: 'bt-artists',
	styles: [`
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

	constructor(private artistService: ArtistService) {}

	ngOnInit() {
		this.artistService.loadAll().subscribe(
			(artists: Artist[]) => {
				this.artists = artists;
			}
		)
	}
}
