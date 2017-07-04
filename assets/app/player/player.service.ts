import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/Rx';
import { Observable } from 'rxjs';

import { Player } from './player';
import { Artist } from '../artists/artist';
import { Album } from '../albums/album';
import { Track } from '../tracks/track';

@Injectable()
export class PlayerService
{
	player: Player;
	public isPlaying: boolean;

	public currentTrack: Track;
	public currentAlbum: Album;
	public currentArtist: Artist;
	public queue;

	constructor(){ }

	/**
	 * Plays a single track.
	 */
	play(track)
	{
		this.queue = [];
	}
}
