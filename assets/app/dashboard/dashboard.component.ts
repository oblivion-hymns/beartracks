import { Component, OnInit } from '@angular/core';

import { Album } from './../albums/album';
import { AlbumService } from './../albums/album.service';
import { PlayerService } from '../player/player.service';
import { Track } from './../tracks/track';
import { TrackService } from './../tracks/track.service';

@Component({
	providers: [AlbumService, TrackService],
	selector: 'bt-dashboard',
	styles: [`
		.item-line
		{
			padding: 5px;
			overflow: hidden;
		}

		.item-line:hover
		{
			background-color: rgba(40, 40, 40, 0.87);
			cursor: pointer;
		}

		.item-line img
		{
			float: left;
			height: 48px;
			margin-right: 10px;
			width: 48px;
		}

		.item-line .item-text
		{
			display: block;
			line-height: 24px;
			margin-top: 0;
			white-space: normal;
		}

		.item-line .item-text-single
		{
			display: block;
			line-height: 24px;
			text-overflow: ellipsis;
			overflow-x: hidden;
		}

		.item-line .item-text-single.item-text-description
		{
			color: rgba(255, 255, 255, 0.34);
		}
	`],
	templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit
{
	albums: Album[] = [];
	recentTracks: Track[] = [];
	loadingAlbums: boolean = true;
	loadingRecent: boolean = true;

	constructor(private playerService: PlayerService,
				private albumService: AlbumService,
				private trackService: TrackService) {}

	ngOnInit()
	{
		this.albumService.loadRecent().subscribe((albums: Album[]) => {
			this.albums = albums;
			this.loadingAlbums = false;
		});

		this.trackService.loadRecentlyPlayed().subscribe((tracks: Track[]) => {
			console.log(tracks);
			this.recentTracks = tracks;
			this.loadingRecent = false;
		});
	}
}
