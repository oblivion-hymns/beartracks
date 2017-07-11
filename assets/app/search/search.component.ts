import { Component, Input, OnInit } from '@angular/core';

import { Artist } from './../artists/artist';
import { Album } from './../albums/album';
import { Track } from './../tracks/track';
import { PlayerService } from '../player/player.service';
import { ArtistService } from './../artists/artist.service';
import { AlbumService } from './../albums/album.service';
import { TrackService } from './../tracks/track.service';

@Component({
	providers: [ArtistService, AlbumService, TrackService],
	selector: 'bt-search',
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
	templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
	artists: Artist[] = [];
	albums: Album[] = [];
	tracks: Track[] = [];
	artistsLoading: boolean = false;
	albumsLoading: boolean = false;
	tracksLoading: boolean = false;
	@Input() filterQuery: string = '';

	constructor(private playerService: PlayerService,
				private artistService: ArtistService,
				private albumService: AlbumService,
				private trackService: TrackService) {}

	ngOnInit()
	{

	}

	set filterString(value)
	{
		var self = this;
		var key = value.trim();

		if (key.length > 2)
		{
			this.artistsLoading = true;
			this.albumsLoading = true;
			this.tracksLoading = true;

			this.artistService.find(key).subscribe(function(artists){
				self.artists = artists;
				self.artistsLoading = false;
			});

			this.albumService.find(key).subscribe(function(albums){
				self.albums = albums;
				self.albumsLoading = false;
			});

			this.trackService.find(key).subscribe(function(tracks){
				self.tracks = tracks;
				self.tracksLoading = false;
			});
		}

		this.filterQuery = key;
	}
}
