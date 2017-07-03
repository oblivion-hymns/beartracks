import { Component, Input, OnInit, NgZone } from '@angular/core';

import { Album } from './album';
import { AlbumService } from './album.service';

@Component({
	providers: [AlbumService],
	selector: 'bt-albums',
	styles: [`
		#AlbumsToolbar {
			background-color: rgba(0, 0, 0, 0.54);
			border-radius: 3px;
			padding: 12px;
			position: fixed;
			right: 0px;
			top: 96px;
			z-index: 5;
		}

		#FilterAlbums input {
			color: rgba(255, 255, 255, 0.54);
		}

		.album-name
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

		.album-artist
		{
			display: inline-block;
			font-size: 12px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			max-width: 100%;
			width: 100%;
		}
	`],
	templateUrl: './albums.component.html'
})
export class AlbumsComponent implements OnInit
{
	albums: Album[] = [];
	displayAlbums: Album[] = [];

	screenWidth: number;
	@Input() filterQuery = '';

	zoomLevels = [
		{scale: 4},
		{scale: 6},
		{scale: 8},
		{scale: 10},
		{scale: 12},
		{scale: 14}
	];
	zoomIndex = 0;

	constructor(private albumService: AlbumService, private ngZone: NgZone) {
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
		this.albumService.loadAll().subscribe(
			(albums: Album[]) => {
				this.albums = albums;
				this.displayAlbums = albums.slice();
			}
		)
	}

	set filterString(value)
	{
		this.displayAlbums = this.albums.slice();

		if (value)
		{
			value = value.toLowerCase();
			this.displayAlbums = this.displayAlbums.filter(
				album => album.nameKey.includes(value.replace(/ /g, ''))
			);
		}
	}

	filterAlbums(query)
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
