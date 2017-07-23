import { Component, OnInit } from '@angular/core';

import { Album } from './../albums/album';
import { AlbumService } from './../albums/album.service';
import { PlayerService } from '../player/player.service';
import { Track } from './../tracks/track';
import { TrackService } from './../tracks/track.service';
import { UserService } from './../user/user.service';

import * as dateformat from 'dateformat';

@Component({
	providers: [AlbumService, PlayerService, TrackService, UserService],
	selector: 'bt-dashboard',
	templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit
{
	albums: Album[] = [];
	recentTracks: Track[] = [];
	loadingAlbums: boolean = true;
	loadingRecent: boolean = true;

	constructor(private playerService: PlayerService,
				private userService: UserService,
				private albumService: AlbumService,
				private trackService: TrackService) { }

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

		console.log(this.userService.isLoggedIn());
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

		var inputDate = new Date(date);
		return dateformat(inputDate, 'mmm d, h:MMtt');
		if (inputDate.getDate() >= today.getDate())
		{
			return "Today";
		}
		else if (inputDate.getDate() >= yesterday.getDate())
		{
			return "Yesterday";
		}


	}
}
