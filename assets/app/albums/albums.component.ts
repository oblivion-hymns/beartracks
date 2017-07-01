import { Component, Input, OnInit } from '@angular/core';

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
	`],
	templateUrl: './albums.component.html'
})
export class AlbumsComponent {
	albums: Album[] = [];
	displayAlbums: Album[] = [];

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

	constructor(private albumService: AlbumService) {}

	ngOnInit()
	{
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
				album => album.nameKey.includes(value));
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
