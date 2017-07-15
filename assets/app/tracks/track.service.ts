import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/Rx';
import { Observable } from 'rxjs';

import { Track } from './track';

@Injectable()
export class TrackService
{
	private tracks: Track[] = [];

	constructor(private http: Http) {}

	find(query)
	{
		var getUrl = 'http://bwilbur.com:3000/tracks/find?query=' + query;
		return this.http.get(getUrl)
			.map((response: Response) => {
				const data = response.json().tracks;

				let tracks: Track[] = [];
				for (let trackData of data)
				{
					var name = trackData.name;
					var nameKey = trackData.nameKey;
					var album = trackData.album;
					var discNum = trackData.discNum;
					var trackNum = trackData.trackNum;
					var genre = trackData.genre;
					var length = trackData.length;
					var filePath = trackData.filePath;

					var track = new Track(name, nameKey, album, discNum, trackNum, genre, length, filePath);
					tracks.push(track);
				}

				return tracks;
			})
			.catch((error: Response) => Observable.throw(error.json()));
	}

	/**
	 * Loads and returns a random track
	 */
	loadRandom()
	{
		return this.http.get('http://bwilbur.com/tracks/random')
			.map((response: Response) => {
				const trackData = response.json().track;
				var name = trackData.name;
				var nameKey = trackData.nameKey;
				var album = trackData.album;
				var discNum = trackData.discNum;
				var trackNum = trackData.trackNum;
				var genre = trackData.genre;
				var length = trackData.length;
				var filePath = trackData.filePath;
				var track = new Track(name, nameKey, album, discNum, trackNum, genre, length, filePath);
				return track;
			})
			.catch((error: Response) => Observable.throw(error.json()));
	}

	loadForAlbum(albumId)
	{
		const body = JSON.stringify({albumId: albumId});
		const headers = new Headers({'Content-Type': 'application/json'});

		return this.http.post('http://bwilbur.com/tracks/album', body, {headers: headers})
			.map((response: Response) => {
				const data = response.json().tracks;

				let tracks: Track[] = [];
				for (let trackData of data)
				{
					var name = trackData.name;
					var nameKey = trackData.nameKey;
					var album = trackData.album;
					var discNum = trackData.discNum;
					var trackNum = trackData.trackNum;
					var genre = trackData.genre;
					var length = trackData.length;
					var filePath = trackData.filePath;

					var track = new Track(name, nameKey, album, discNum, trackNum, genre, length, filePath);
					tracks.push(track);
				}

				return tracks;
			})
			.catch((error: Response) => Observable.throw(error.json()));
	}

	loadAll()
	{
		return this.http.get('http://bwilbur.com/tracks/all')
			.map((response: Response) => {
				const data = response.json().tracks;

				let tracks: Track[] = [];
				for (let trackData of data)
				{
					var name = trackData.name;
					var nameKey = trackData.nameKey;
					var album = trackData.album;
					var discNum = trackData.discNum;
					var trackNum = trackData.trackNum;
					var genre = trackData.genre;
					var length = trackData.length;
					var filePath = trackData.filePath;

					var track = new Track(name, nameKey, album, discNum, trackNum, genre, length, filePath);
					tracks.push(track);
				}
				this.tracks = tracks;
				return tracks;
			})
			.catch((error: Response) => Observable.throw(error.json()));
	}
}
