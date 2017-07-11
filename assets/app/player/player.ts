import { OnInit } from '@angular/core';

import { Artist } from '../artists/artist';
import { Album } from '../albums/album';
import { Track } from '../tracks/track';

export class Player implements OnInit
{
	private audio;
	private interval;
	public isPlaying: boolean;
	public volume: number = 0.5;

	public elapsedInterval;
	public elapsed = '0:00';
	public elapsedPercent = 0;

	public currentTrack: Track;
	public queue = [];
	public queuePosition = 0;
	public queueOpen: boolean = false;

	constructor() { }

	ngOnInit()
	{

	}

	setVolume(value)
	{
		this.volume = value/100;
		this.audio.volume = this.volume;
	}

	enqueueOne(track)
	{
		this.queue.push(track);
		this.openQueue();
	}

	enqueueMany(tracks)
	{
		this.queue = [];
		if (this.audio)
		{
			this.audio.pause();
			this.audio.currentTime = 0;
			this.audio = null;
		}

		for (var i in tracks)
		{
			this.queue.push(tracks[i]);
		}

		this.playPosition(0);
		this.openQueue();
	}

	/**
	 * Plays a single track.
	 */
	playOne(track)
	{
		this.elapsedPercent = 0;
		this.elapsed = '0:00';

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
		this.audio.volume = this.volume;

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
		this.elapsedPercent = 0;
		this.elapsed = '0:00';

		this.queuePosition = index;
		this.currentTrack = this.queue[this.queuePosition];

		if (this.audio)
		{
			this.audio.pause();
			this.audio.currentTime = 0;
			this.audio = null;
		}

		this.audio = new Audio(this.currentTrack.filePath);
		this.audio.play();
		this.audio.volume = this.volume;

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
			if (length_m == 0)
			{
				length_m = '0';
			}
			else if (length_m < 10 && length_h > 0)
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

		if (this.elapsedPercent >= 100)
		{
			this.elapsedPercent = 0;
			this.elapsed = '0:00';
			if (this.queue[this.queuePosition] + 1)
			{
				this.playPosition(this.queuePosition + 1);
			}
			else
			{
				this.pause();
			}
		}
	}

	openQueue()
	{
		this.queueOpen = true;
	}

	closeQueue()
	{
		this.queueOpen = false;
	}
}
