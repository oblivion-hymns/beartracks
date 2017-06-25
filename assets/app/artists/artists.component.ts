import { Component } from '@angular/core';

@Component({
	selector: 'bt-artists',
	styles: [`
		md-grid-tile {
			background-repeat: no-repeat;
			background-position: center center;
			background-size: cover;
			opacity: 0.65;
			transition:.25s;
		}

		md-grid-tile:hover {
			cursor: pointer;
			opacity: 1.0;
		}
	`],
	templateUrl: './artists.component.html'
})
export class ArtistsComponent {
	artists = [
		{name: 'A Winged Victory for the Sullen', imageUrl: 'http://www.sagegateshead.com/files/images/applicationfiles/3919.5168.AWVFTSatDDRstudios_print/590x372.fitandcrop.jpg'},
		{name: 'Stars of the Lid', imageUrl: 'http://www.kranky.net/images/photos/sotl.jpg'},
		{name: 'Blackbear', imageUrl: 'http://isthmus.com/downloads/44056/download/calendar-Black-Bear.jpeg?cb=d9c0bd2ee9b616b8aa142c14d132ed50'},
		{name: 'Purity Ring', imageUrl: 'https://ichef.bbci.co.uk/images/ic/976x549/p02cll7s.jpg'},
		{name: 'Eden', imageUrl: 'https://i.ytimg.com/vi/0pVABElms84/maxresdefault.jpg'},
		{name: 'Ólafur Arnalds', imageUrl: 'https://pbs.twimg.com/profile_images/742683628321181696/DOnkICFh.jpg'},
	];
}
