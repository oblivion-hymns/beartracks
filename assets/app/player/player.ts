import { OnInit } from '@angular/core';

import { Artist } from '../artists/artist';
import { Album } from '../albums/album';
import { Track } from '../tracks/track';

export class Player implements OnInit
{
	private audio;
	private interval;
	public isPlaying: boolean;

	public elapsedInterval;
	public elapsed;
	public elapsedPercent;

	public currentTrack: Track;
	public queue = [];
	public queuePosition = 0;

	constructor() { }

	ngOnInit()
	{

	}

	enqueueOne(track)
	{
		this.queue.push(track);
	}

	enqueueMany(tracks)
	{
		this.queue = [];
		this.queuePosition = 0;
		if (this.audio)
		{
			this.audio.pause();
			this.audio.currentTime = 0;
			this.audio = null;
		}
	}

	/**
	 * Plays a single track.
	 */
	playOne(track)
	{
		this.queue = [];
		this.queuePosition = 0;
		this.currentTrack = track;

		if (this.audio)
		{
			this.audio.pause();
			this.audio.currentTime = 0;
			this.audio = null;
		}

		this.audio = new Audio(track.filePath);
		this.audio.play();

		if (!this.elapsedInterval)
		{
			this.elapsedInterval = setInterval(()=> {
				this.getElapsed();
				this.getElapsedPercent();
			}, 1000);
		}
	}

	playPosition(index)
	{
		console.log(this.queue);
		this.currentTrack = this.queue[index];

		if (this.audio)
		{
			this.audio.pause();
			this.audio.currentTime = 0;
			this.audio = null;
		}

		this.audio = new Audio(this.currentTrack.filePath);
		this.audio.play();

		if (!this.elapsedInterval)
		{
			this.elapsedInterval = setInterval(()=> {
				this.getElapsed();
				this.getElapsedPercent();
			}, 1000);
		}
	}

	pause()
	{
		if (this.audio)
		{
			this.audio.pause();
		}
	}

	resume()
	{
		if (this.audio)
		{
			this.audio.play();
		}
	}

	getElapsed()
	{
		if (this.currentTrack)
		{
			var tempLength = parseInt(this.audio.currentTime);
			var length_h = 0;
			var length_m;
			var length_s;

			//Hours
			while (tempLength >= 3600)
			{
				length_h += 1;
				tempLength -= 3600;
			}

			//Minutes
			length_m = 0;
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

			this.elapsed = elapsed;
		}
		else
		{
			this.elapsed = '0:00';
		}
	}

	getElapsedPercent()
	{
		if (this.currentTrack)
		{
			this.elapsedPercent = (this.audio.currentTime / parseInt(this.currentTrack.length)) * 100;
		}
		else
		{
			this.elapsedPercent = 0;
		}
	}
}
