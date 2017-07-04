import { OnInit } from '@angular/core';

import { Artist } from '../artists/artist';
import { Album } from '../albums/album';
import { Track } from '../tracks/track';

import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';

export class Player implements OnInit
{
	private audio;
	private interval;
	public isPlaying: boolean;

	public elapsedObservable;
	public elapsedPercentObservable;

	public currentTrack: Track;
	public queue;

	constructor()
	{
		this.elapsedObservable = Observable.interval(1000).flatMap(this.getElapsed);
		this.elapsedPercentObservable = Observable.interval(1000).flatMap(this.getElapsedPercent);
	}

	ngOnInit()
	{

	}

	/**
	 * Plays a single track.
	 */
	play(track)
	{
		this.queue = [];
		this.queue.push(track);
		this.currentTrack = track;

		this.audio = new Audio(track.filePath);
		this.audio.play();
	}

	getElapsed()
	{
		console.log('Hello world!');
		if (this.currentTrack)
		{
			var tempLength = parseInt(this.audio.duration);
			var length_h = null;
			var length_m = null;
			var length_s = null;

			//Hours
			while (tempLength >= 3600)
			{
				length_h += 1;
				tempLength -= 3600;
			}

			//Minutes
			while (tempLength >= 60)
			{
				length_m += 1;
				tempLength -= 60;
			}
			if (length_m < 10 && length_h > 0)
			{
				length_m = '0' + length_m;
			}

			length_s = tempLength;
			if (length_s < 10)
			{
				length_s = '0' + length_s;
			}

			var elapsed = '';
			if (length_h > 0)
			{
				elapsed = '' + length_h + ':' + length_m + ':' + length_s;
			}
			else
			{
				elapsed = '' + length_m + ':' + length_s;
			}

			return elapsed;
		}
	}

	getElapsedPercent()
	{
		return ((this.audio.duration / parseInt(this.currentTrack.length)) * 100).toString();
	}
}
