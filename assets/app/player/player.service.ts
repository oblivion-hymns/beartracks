import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Lightbox } from 'angular2-lightbox';
import { PushNotificationsService } from 'angular2-notifications';

import 'rxjs/Rx';
import { Observable } from 'rxjs';

import { Album } from '../albums/album';
import { Artist } from '../artists/artist';
import { Player } from './player';
import { Track } from '../tracks/track';
import { TrackService } from '../tracks/track.service';

@Injectable()
export class PlayerService
{
	public isPlaying: boolean;
	public player: Player;

	constructor(private trackService: TrackService,
				private http: Http,
				private _lightbox: Lightbox,
				private _pushNotifications: PushNotificationsService)
	{
		this.player = new Player(this.http, this.trackService, this._pushNotifications);
		this._pushNotifications.requestPermission();
	}

	/**
	 * Opens a pretty lightbox with the given album's art inside it
	 */
	openLightbox(album: Album)
	{
		var albums = [
			{
				caption: album.artist.name + ' - "' + album.name + '" (' + album.year + ')',
				src: album.imagePath,
				thumb: album.imagePath
			}
		];

		this._lightbox.open(albums, 0);
	}

	/**
	 * Opens a lightbox displaying an artist's picture
	 */
	openLightboxArtist(artist: Artist)
	{
		var artists = [
			{
				caption: artist.name,
				src: artist.imagePath,
				thumb: artist.imagePath
			}
		];

		this._lightbox.open(artists, 0);
	}

	/**
	 * Skips the currently-playing track
	 */
	skipTrack()
	{
		if (this.player.currentTrack)
		{
			if (this.player.isRadio)
			{
				this.player.playTrackInGenre(this.player.homeGenre);
			}
			else
			{
				this.player.playPosition(this.player.queuePosition + 1);
			}
		}
	}

	/**
	 * Recommends the given track
	 * @var Track track
	 */
	recommendTrack(track)
	{
		this.trackService.recommendTrack(track).subscribe();
	}

	/**
	 * Replaces the queue with the given album
	 */
	playAlbum(album)
	{
		this.trackService.loadForAlbum(album._id).subscribe(
			(tracks: Track[]) => {
				var allTracks = [];
				for (var i in tracks)
				{
					allTracks.push(tracks[i]);
				}

				this.player.playMany(allTracks);
			}
		)
	}

	/**
	 * Appends the given album to the end of the current queue
	 */
	enqueueAlbum(album)
	{
		this.trackService.loadForAlbum(album._id).subscribe(
			(tracks: Track[]) => {
				var allTracks = [];
				for (var i in tracks)
				{
					allTracks.push(tracks[i]);
				}

				this.player.enqueueMany(allTracks);
			}
		)
	}

	/**
	 * Enqueues the given album but continues playing the given track in the scope of the album
	 * @param Album album
	 */
	enqueueSmart(album)
	{
		this.trackService.loadForAlbum(album._id).subscribe(
			(tracks: Track[]) => {
				var allTracks = [];
				for (let i = 0; i < tracks.length; i++)
				{
					allTracks.push(tracks[i]);
				}

				this.player.enqueueSmart(allTracks);
			}
		)
	}

	/**
	 * Plays a mix containing all tracks from a given artist
	 */
	playArtist(artist)
	{
		this.trackService.loadForArtist(artist._id).subscribe(
			(tracks: Track[]) => {
				this.player.playMany(tracks);
			}
		)
	}

	enableRadio()
	{
		this.player.isRadio = true;
		if (this.player.currentTrack)
		{
			this.player.homeGenre = this.player.currentTrack.genre;
		}
	}

	disableRadio()
	{
		this.player.isRadio = false;
	}
}
