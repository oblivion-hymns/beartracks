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

	constructor()
	{
		this.player = new Player();
	}
}
