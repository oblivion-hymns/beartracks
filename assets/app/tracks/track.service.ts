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

					var track = new Track(name, nameKey, album, discNum, trackNum, genre, length);
					tracks.push(track);
				}
				this.tracks = tracks;
				return tracks;
			})
			.catch((error: Response) => Observable.throw(error.json()));
	}
}
