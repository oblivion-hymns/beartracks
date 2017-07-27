import { Component, Input, OnInit } from '@angular/core';

import { Artist } from './../artists/artist';
import { Album } from './../albums/album';
import { Track } from './../tracks/track';
import { PlayerService } from '../player/player.service';
import { ArtistService } from './../artists/artist.service';
import { AlbumService } from './../albums/album.service';
import { TrackService } from './../tracks/track.service';
import { UserService } from './../user/user.service';

@Component({
	providers: [ArtistService, AlbumService, TrackService],
	selector: 'bt-search',
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
				private userService: UserService,
				private artistService: ArtistService,
				private albumService: AlbumService,
				private trackService: TrackService) {}

	ngOnInit()
	{

	}

	set filterString(value)
	{
		var key = value.trim();

		if (key.length > 2)
		{
			this.artistsLoading = true;
			this.albumsLoading = true;
			this.tracksLoading = true;

			this.artistService.find(key).subscribe(artists => {
				this.artists = artists;
				this.artistsLoading = false;
			});

			this.albumService.find(key).subscribe(albums => {
				this.albums = albums;
				this.albumsLoading = false;
			});

			this.trackService.find(key).subscribe(tracks => {
				this.tracks = tracks;
				this.tracksLoading = false;
			});
		}

		this.filterQuery = key;
	}
}
