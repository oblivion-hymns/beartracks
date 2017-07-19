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
	player: Player;
	public isPlaying: boolean;

	constructor(private trackService: TrackService, private http: Http)
	{
		this.player = new Player(http);
	}

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
}
