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
	filterQuery: string = '';

	constructor(private artistService: ArtistService,
				private albumService: AlbumService,
				private trackService: TrackService) {}

	ngOnInit()
	{

	}

	set filterString(value)
	{

	}
}
