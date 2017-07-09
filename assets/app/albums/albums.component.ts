import { Component, Input, OnInit } from '@angular/core';

import { PlayerService } from '../player/player.service';
import { Album } from './album';
import { AlbumService } from './album.service';
import { TrackService } from '../tracks/track.service';

@Component({
	providers: [AlbumService, TrackService],
	selector: 'bt-albums',
	styles: [`
		#FilterAlbums input {
			color: rgba(255, 255, 255, 0.54);
		}

		.album-artist
		{
			color: rgba(255, 255, 255, 0.38);
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

	@Input() filterQuery = '';

	constructor(private playerService: PlayerService,
				private albumService: AlbumService,
				private trackService: TrackService) {}

	ngOnInit()
	{
		this.albumService.loadAll().subscribe(
			(albums: Album[]) => { this.albums = albums; }
		)
	}

	set filterString(value)
	{
		this.displayAlbums = [];

		value = value.trim().toLowerCase().replace(/\W/g, '');
		if (value && value.length > 2)
		{
			this.displayAlbums = this.albums.filter(
				album => album.nameKey.includes(value));
		}

		this.filterQuery = value;
	}

	filterAlbums(query)
	{
		this.filterQuery = query;
	}
}
