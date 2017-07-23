import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/Rx';
import { Observable } from 'rxjs';

import { Player } from './player';
import { Artist } from '../artists/artist';
import { Album } from '../albums/album';
import { Track } from '../tracks/track';
import { TrackService } from '../tracks/track.service';

@Injectable()
export class PlayerService
{
	public isPlaying: boolean;
	public player: Player;

	constructor(private trackService: TrackService, private http: Http)
	{
		this.player = new Player(this.http, this.trackService);
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

	enableRadio()
	{
		this.player.isRadio = true;
	}

	disableRadio()
	{
		this.player.isRadio = false;
	}
}
