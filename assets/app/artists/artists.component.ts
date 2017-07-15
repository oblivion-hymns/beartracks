import { Component, Input, OnInit } from '@angular/core';

import { Album } from './../albums/album';
import { AlbumService } from './../albums/album.service';
import { Artist } from './artist';
import { ArtistService } from './artist.service';
import { PlayerService } from './../player/player.service';
import { Track } from './../tracks/track';
import { TrackService } from './../tracks/track.service';

@Component({
	providers: [ArtistService, AlbumService, TrackService],
	selector: 'bt-artists',
	styleUrls: ['./artists.component.css'],
	templateUrl: './artists.component.html'
})
export class ArtistsComponent implements OnInit {
	album: Album[] = [];
	albumSelected: boolean = false;
	albums: Album[] = [];
	artist: Artist[] = [];
	artistSelected: boolean = false;
	artists: Artist[] = [];
	displayArtists: Artist[] = [];
	tracks: Track[] = [];

	loadingAlbums: boolean = false;
	loadingArtists: boolean = true;
	loadingTracks: boolean = false;

	constructor(private playerService: PlayerService,
				private artistService: ArtistService,
				private albumService: AlbumService,
				private trackService: TrackService) {}

	ngOnInit()
	{
		this.artistService.loadAll().subscribe((artists: Artist[]) => {
			this.artists = artists;
			this.displayArtists = artists.slice();
			this.loadingArtists = false;
		});
	}

	/**
	 * Loads all albums for the given artist
	 */
	loadAlbums(artist: Artist)
	{
		this.artist = artist;
		this.albums = [];
		this.tracks = [];
		this.loadingAlbums = true;
		this.albumService.loadForArtist(artist).subscribe((albums: Album[]) => {
			this.albums = albums;
			this.loadingAlbums = false;
		});
	}

	/**
	 * Loads all tracks for the given album
	 */
	loadTracks(album: Album)
	{
		this.album = album;
		this.tracks = [];
		this.loadingTracks = true;
		this.trackService.loadForAlbum(album._id).subscribe((tracks: Track[]) => {
			this.tracks = tracks;
			this.loadingTracks = false;
		});
	}

	set filterString(value)
	{
		this.displayArtists = this.artists.slice();

		value = value.trim().toLowerCase().replace(/\W/g, '');
		if (value.length > 0)
		{
			this.displayArtists = this.artists.filter(artist => artist.nameKey.includes(value));
		}
	}
}
