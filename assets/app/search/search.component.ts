import { Component, Input, OnInit } from '@angular/core';

import { Artist } from './../artists/artist';
import { Album } from './../albums/album';
import { Track } from './../tracks/track';
import { ArtistService } from './../artists/artist.service';
import { AlbumService } from './../albums/album.service';
import { TrackService } from './../tracks/track.service';

@Component({
	providers: [ArtistService, AlbumService, TrackService],
	selector: 'bt-search',
	styles: [``],
	templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
	artists: Artist[] = [];
	albums: Album[] = [];
	tracks: Track[] = [];
	numResults: number = 0;
	filterQuery: string = '';

	constructor(private artistService: ArtistService,
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
			this.artistService.find(key).subscribe(function(artists){
				this.artists = artists;
				this.results = self.artists.length + self.albums.length + self.tracks.length;
			});

			this.albumService.find(key).subscribe(function(albums){
				this.albums = albums;
				this.results = self.artists.length + self.albums.length + self.tracks.length;
			});

			this.trackService.find(key).subscribe(function(tracks){
				this.tracks = tracks;
				this.results = self.artists.length + self.albums.length + self.tracks.length;
			});
		}
	}
}
