import { Http, Response, Headers } from '@angular/http';
import { OnInit } from '@angular/core';

import { Album } from '../albums/album';
import { Artist } from '../artists/artist';
import { Track } from '../tracks/track';

export class Player implements OnInit
{
	private audio;
	private interval;
	public isPlaying: boolean;
	public volume: number = 0.5;
	public oldVolume: number = 0.5;

	public elapsedInterval;
	public elapsed = '0:00';
	public elapsedPercent = 0;

	public currentTrack: Track;
	public queue = [];
	public queuePosition = -1;
	public queueOpen: boolean = false;
	public visible: boolean = true;
	private http: Http;

	constructor(http: Http)
	{
		this.http = http;
	}

	ngOnInit()
	{

	}

	/**
	 * Sets the volume to the given value (between 0.0 and 1.0)
	 * @param number value
	 */
	setVolume(value)
	{
		this.volume = value;
		this.audio.volume = this.volume;
	}

	/**
	 * Turns off the player's volume. Holds on to the old volume value for unmuting
	 */
	mute()
	{
		this.oldVolume = this.volume;
		this.setVolume(0);
	}

	/**
	 * Returns the player from a muted state to its prior volume
	 */
	unmute()
	{
		this.setVolume(this.oldVolume);
	}

	/**
	 * Completely resets the audio object if it exists
	 */
	resetAudio()
	{
		if (this.audio)
		{
			this.audio.pause();
			this.audio.currentTime = 0;
			this.audio = null;
		}
	}

	/**
	 * Resets all properties of the player (as in, starting a new song).
	 * Returns the state of the player to completely fresh -- no track, no queue, no song playing
	 */
	resetPlayer()
	{
		this.resetAudio();

		//Reset queue
		this.queue = [];
		this.queuePosition = -1;
		this.currentTrack = null;

		//Reset time elapsed
		this.elapsedPercent = 0;
		this.elapsed = '0:00';
	}

	/**
	 * Ensures that "Time elapsed" tracking is happening
	 */
	checkTimeInterval()
	{
		if (!this.elapsedInterval)
		{
			this.elapsedInterval = setInterval(()=> {
				this.getElapsed();
				this.getElapsedPercent();
			}, 1000);
		}
	}



	/**
	 * Replaces the queue with a single track and plays that track
	 * @param Track track
	 */
	playOne(track)
	{
		this.resetPlayer();
		this.queue.push(track);
		this.playFromBeginning();
	}

	/**
	 * Replaces the queue with a list of tracks and begins playing the first track
	 * @param Track[] tracks
	 */
	playMany(tracks)
	{
		this.resetPlayer();
		for (var i = 0; i < tracks.length; i++)
		{
			this.queue.push(tracks[i]);
		}
		this.playFromBeginning();
	}

	/**
	 * Plays the current queue starting from the beginning.
	 */
	playFromBeginning()
	{
		this.queuePosition = 0;
		this.currentTrack = this.queue[this.queuePosition];
		this.audio = new Audio(this.currentTrack.filePath);
		this.audio.play();
		this.audio.volume = this.volume;
		this.checkTimeInterval();
		this.openQueue();
	}

	/**
	 * Plays a single track at a single position in the queue. Does not modify the queue
	 * @param int index - The 0-indexed key for the track to play
	 */
	playPosition(index)
	{
		this.resetAudio();
		this.queuePosition = index;
		this.currentTrack = this.queue[this.queuePosition];
		this.audio = new Audio(this.currentTrack.filePath);
		this.audio.play();
		this.audio.volume = this.volume;
		this.openQueue();

		this.checkTimeInterval();
	}

	/**
	 * Adds the given track to the end of the current queue
	 * @param Track track
	 */
	enqueueOne(track)
	{
		this.queue.push(track);
		this.openQueue();
	}

	/**
	 * Adds the given list of tracks to the end of the current queue
	 */
	enqueueMany(tracks)
	{
		for (var i in tracks)
		{
			this.queue.push(tracks[i]);
		}

		this.openQueue();
	}



	/**
	 * Temporarily pauses audio playback
	 */
	pause()
	{
		if (this.audio)
		{
			this.audio.pause();
		}
	}

	/**
	 * Resumes audio playback from a paused state
	 */
	resume()
	{
		if (this.audio)
		{
			this.audio.play();
		}
	}

	/**
	 * Completely hides the player from the screen (i.e. no clickable tab or interaction possible)
	 */
	hide()
	{
		this.visible = false;
	}

	/**
	 * Returns the player from its completely invisible state
	 */
	show()
	{
		this.visible = true;
	}

	/**
	 * Calculates the elapsed time of the current track
	 */
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

			//Increment play count
			var finishedTrack = this.currentTrack;
			this.http.get('http://bwilbur.com:3000/tracks/increment-song?trackId=' + finishedTrack._id).subscribe();

			if (this.queue[this.queuePosition + 1])
			{
				this.playPosition(this.queuePosition + 1);
			}
			else
			{
				this.pause();
			}

			//this.currentTrack = null;
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
