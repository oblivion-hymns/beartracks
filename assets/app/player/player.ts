import { Http, Response, Headers } from '@angular/http';
import { PushNotificationsService } from 'angular2-notifications';

import { Album } from '../albums/album';
import { Artist } from '../artists/artist';
import { Track } from '../tracks/track';
import { TrackService } from '../tracks/track.service';
import * as browser from 'detect-browser';

export class Player
{
	private audio;
	private interval;
	public isPlaying: boolean;
	public isLoading: boolean = false;
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

	public isRadio: boolean = false;
	public degree: number = 0;
	public homeGenre: string = '';

	public chromeOnCanPlayCount: number = 0;

	private http: Http;
	private trackService: TrackService;
	private pushNotifications: PushNotificationsService;

	constructor(http: Http, trackService: TrackService, pushNotifications: PushNotificationsService)
	{
		this.http = http;
		this.trackService = trackService;
		this.pushNotifications = pushNotifications;
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
			this.audio.src = '🤔';
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
		this.openQueue();
	}

	/**
	 * Replaces the queue with a list of tracks and begins playing the first track
	 * @param Track[] tracks
	 */
	playMany(tracks)
	{
		this.resetPlayer();
		this.isRadio = false;
		for (var i = 0; i < tracks.length; i++)
		{
			this.queue.push(tracks[i]);
		}
		this.playFromBeginning();
		this.openQueue();
	}

	/**
	 * Plays a random track from the given genre
	 */
	playTrackInGenre(genre)
	{
		this.resetPlayer();
		this.trackService.loadByGenre(genre).subscribe(track => {
			this.queue.push(track);
			this.playFromBeginning();
		})
	}

	/**
	 * Plays a track related to the given one by the given degree
	 * @param Track track
	 * @param number degree
	 */
	playRelated(track, degree)
	{
		this.resetPlayer();

		this.trackService.loadRelatedByGenre(this.homeGenre, this.degree).subscribe(track => {
			this.queue.push(track);
			this.playFromBeginning();
		})
	}

	/**
	 * Plays the current queue starting from the beginning.
	 */
	playFromBeginning()
	{
		this.resetAudio();
		this.queuePosition = 0;
		this.currentTrack = this.queue[this.queuePosition];
		this.isLoading = true;

		this.audio = new Audio();

		this.trackService.loadTrack(this.currentTrack.filePath).subscribe(blob => {
			var blobPath = window.URL.createObjectURL(blob);
			this.audio = new Audio(blobPath);
			this.audio.preload = 'auto';
			this.audio.load();
			this.audio.oncanplaythrough = () => {
				console.log('ready');
				/*this.isLoading = false;
				this.audio.play();
				this.audio.volume = this.volume;
				this.checkTimeInterval();

				var body = this.currentTrack.album.artist.name + ' - "' + this.currentTrack.name + '"\n';
				body += this.currentTrack.album.name + ' (' + this.currentTrack.album.year + ')';

				this.pushNotifications.create('Now Playing', {
					body: body,
					icon: this.currentTrack.album.imagePath
				}).subscribe();*/
			};
		});



	}

	/**
	 * Plays a single track at a single position in the queue. Does not modify the queue
	 * @param int index - The 0-indexed key for the track to play
	 */
	playPosition(index)
	{
		if (index < this.queue.length)
		{
			this.resetAudio();
			this.isRadio = false;
			this.queuePosition = index;
			this.currentTrack = this.queue[this.queuePosition];
			this.homeGenre = this.currentTrack.genre;
			this.isLoading = true;
			this.audio = new Audio(this.currentTrack.filePath);
			this.audio.load();
			this.audio.oncanplaythrough = () => {
				console.log('on can play through');
				this.isLoading = false;
				this.audio.play();
				this.audio.volume = this.volume;
			};

			this.checkTimeInterval();

			var body = this.currentTrack.album.artist.name + ' - "' + this.currentTrack.name + '"\n';
			body += this.currentTrack.album.name + ' (' + this.currentTrack.album.year + ')';

			this.pushNotifications.create('Now Playing', {
				body: body,
				icon: this.currentTrack.album.imagePath
			}).subscribe();
		}
		else
		{
			this.currentTrack = null;
			this.elapsed = '0:00';
			this.elapsedPercent = 0;
			this.pause();
		}
	}

	/**
	 * Adds the given track to the end of the current queue
	 * @param Track track
	 */
	enqueueOne(track)
	{
		this.isRadio = false;
		this.queue.push(track);
		this.openQueue();
	}

	/**
	 * Adds the given list of tracks to the end of the current queue
	 */
	enqueueMany(tracks)
	{
		this.isRadio = false;
		for (var i in tracks)
		{
			this.queue.push(tracks[i]);
		}

		if (!this.currentTrack)
		{
			this.playFromBeginning();
			this.openQueue();
		}
		else
		{
			this.openQueue();
		}
	}

	/**
	 * Replaces the queue with the given tracks, but continues playing the current track
	 * in the scope of the enqueued tracks. Used for "the smart queue" album feature
	 */
	enqueueSmart(tracks)
	{
		this.isRadio = false;
		if (!this.currentTrack)
		{
			//If somehow you got here without a track player, just enqueue the album
			this.enqueueMany(tracks);
		}
		else
		{
			this.queue = [];

			//Keep only the currently-playing track intact & enqueue the rest of the album around it
			for (let i = 0; i < tracks.length; i++)
			{
				var track = tracks[i];
				if (track._id == this.currentTrack._id)
				{
					//Push the exact instance of the track that is already playing
					this.queue.push(this.currentTrack);
					this.queuePosition = i;
				}
				else
				{
					//Push the new track
					this.queue.push(track);
				}
			}
		}
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
			var currentAudioTime = Math.ceil(this.audio.currentTime);
			var currentTrackLength = Math.ceil(parseInt(this.currentTrack.length));

			this.elapsedPercent = Math.ceil(currentAudioTime / currentTrackLength * 100);
		}
		else
		{
			this.elapsedPercent = 0;
		}

		if (this.elapsedPercent > 100)
		{
			this.elapsedPercent = 0;
			this.elapsed = '0:00';

			//Increment play count
			var finishedTrack = this.currentTrack;
			this.http.get('http://bwilbur.com/tracks/increment-song?trackId=' + finishedTrack._id).subscribe();

			if (this.isRadio)
			{
				if (!this.homeGenre)
				{
					this.homeGenre = this.currentTrack.genre;
				}

				this.playRelated(this.currentTrack, this.degree);
			}
			else
			{
				if (this.queue[this.queuePosition + 1])
				{
					this.playPosition(this.queuePosition + 1);
				}
				else
				{
					this.currentTrack = null;
					this.elapsed = '0:00';
					this.elapsedPercent = 0;
					this.pause();
				}
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
