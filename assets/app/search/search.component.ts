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
		.sad-header md-icon.tiny-icon:hover
		{
			color: rgba(255, 255, 255, 0.54);
			cursor: pointer;
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
