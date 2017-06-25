import { Component } from '@angular/core';

@Component({
	selector: 'bt-albums',
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

		.mat-tile-block-display {
			display: block;
			overflow: hidden;
			position: relative;
			text-overflow: ellipsis;
			white-space: nowrap;
			width: 100%;
		}
	`],
	templateUrl: './albums.component.html'
})
export class AlbumsComponent {
	albums = [
		{name: 'and Their Refinement of the Decline', imageUrl: 'https://f4.bcbits.com/img/a3594468699_10.jpg', artist: {name: 'Stars of the Lid'}}
		{name: 'another eternity', imageUrl: 'http://purityringthing.com/images/packshot.jpg', artist: {name: 'Purity Ring'}},
		{name: 'A Winged Victory for the Sullen', imageUrl: 'https://etr-media.s3-eu-west-1.amazonaws.com/540/cover.jpg', artist: {name: 'A Winged Victory for the Sullen'}},
		{name: 'The Feel Good Record of the Year', imageUrl: 'https://f4.bcbits.com/img/a3434783425_10.jpg', artist: {name: 'No Use for a Name'}}
	];
}
