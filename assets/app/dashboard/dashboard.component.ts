import { Component, OnInit } from '@angular/core';

import { Album } from './../albums/album';
import { AlbumService } from './../albums/album.service';
import { Artist } from './../artists/artist';
import { ArtistService } from './../artists/artist.service';
import { PlayerService } from './../player/player.service';
import { Track } from './../tracks/track';
import { TrackService } from './../tracks/track.service';
import { UserService } from './../user/user.service';

import * as dateformat from 'dateformat';

@Component({
	providers: [ArtistService, AlbumService, TrackService, UserService],
	selector: 'bt-dashboard',
	styles: [`
		.item-column
		{
			 padding: 16px;
			 width: 33%;
		}

		.item-column-body
		{
			height: calc(100% - 73px);
			max-height: 100%;
			overflow-y: auto;
		}
	`],
	templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit
{
	albums: Album[] = [];
	recentTracks: Track[] = [];
	recommendedTracks: Track[] = [];
	loadingAlbums: boolean = true;
	loadingRecent: boolean = true;
	loadingRecs: boolean = true;

	constructor(private playerService: PlayerService,
				private artistService: ArtistService,
				private albumService: AlbumService,
				private trackService: TrackService,
				private userService: UserService) {}

	ngOnInit()
	{
		this.albumService.loadRecent().subscribe((albums: Album[]) => {
			this.albums = albums;
			this.loadingAlbums = false;
		});

		this.trackService.loadRecentlyPlayed().subscribe((tracks: Track[]) => {
			this.recentTracks = tracks;
			this.loadingRecent = false;
		});

		this.trackService.loadRecentlyRecommended().subscribe((tracks: Track[]) => {
			this.recommendedTracks = tracks;
			this.loadingRecs = false;
		});
	}

	translateDate(date)
	{
		var now = new Date();
		var year = now.getFullYear();
		var month = now.getMonth() + 1;
		var day = now.getDate();
		var todayString = year + '-' + month + '-' + day;
		var today = new Date(todayString);

		var day = now.getDate() - 1;
		var yesterdayString = year + '-' + month + '-' + day;
		var yesterday = new Date(yesterdayString);

		if (inputDate.getDate() >= today.getDate())
		{
			return "Today";
		}
		else if (inputDate.getDate() >= yesterday.getDate())
		{
			return "Yesterday";
		}

		var inputDate = new Date(date);
		return dateformat(inputDate, 'mmm d, h:MMtt');
	}
}
