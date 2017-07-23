import { Http, Response, Headers, ResponseContentType } from '@angular/http';
import { Injectable } from '@angular/core';

import * as fileSaver from 'file-saver';

import 'rxjs/Rx';
import { Observable } from 'rxjs';

import { Album } from './../albums/album';
import { Track } from './track';

@Injectable()
export class TrackService
{
	private tracks: Track[] = [];

	constructor(private http: Http) {}

	/**
	 * Downloads the given track.
	 * @param Track track
	 */
	download(track)
	{
		return this.http.get('http://bwilbur.com:3000' + track.filePath, {
			responseType: ResponseContentType.Blob
		}).map((res) => {
			return new Blob([res.blob()], { type: 'audio/mpeg' });
		}).subscribe(res => {
			//For now...
			fileSaver.saveAs(res, track.nameKey + '.mp3');
		});
	}

	/**
	 * Downloads the tracks from the given album
	 * @param Album album
	 */
	downloadAlbum(album)
	{
		this.loadForAlbum(album._id).subscribe(tracks => {
			for (var i = 0; i < tracks.length; i++)
			{
				var track = tracks[i];
				this.download(track);
			}
		});
	}

	/**
	 * Finds tracks based on the given query
	 */
	find(query)
	{
		var getUrl = 'http://bwilbur.com:3000/tracks/find?query=' + query;
		return this.http.get(getUrl)
			.map((response: Response) => {
				const data = response.json().tracks;

				let tracks: Track[] = [];
				for (let trackData of data)
				{
					var id = trackData._id;
					var name = trackData.name;
					var nameKey = trackData.nameKey;
					var album = trackData.album;
					var discNum = trackData.discNum;
					var trackNum = trackData.trackNum;
					var genre = trackData.genre;
					var length = trackData.length;
					var filePath = trackData.filePath;
					var playCount = trackData.playCount;
					var updatedAt = trackData.updatedAt;
					var track = new Track(id, name, nameKey, album, discNum, trackNum, genre, length, filePath, playCount, updatedAt);
					tracks.push(track);
				}

				return tracks;
			})
			.catch((error: Response) => Observable.throw(error.json()));
	}

	/**
	 * Loads and returns a random track
	 */
	loadRelated(track, degree)
	{
		var id = track._id;
		return this.http.get('http://bwilbur.com/tracks/related?trackId=' + id + '&degree=' + degree)
			.map((response: Response) => {
				const trackData = response.json().track;
				var id = trackData._id;
				var name = trackData.name;
				var nameKey = trackData.nameKey;
				var album = trackData.album;
				var discNum = trackData.discNum;
				var trackNum = trackData.trackNum;
				var genre = trackData.genre;
				var length = trackData.length;
				var filePath = trackData.filePath;
				var playCount = trackData.playCount;
				var updatedAt = trackData.updatedAt;
				var track = new Track(id, name, nameKey, album, discNum, trackNum, genre, length, filePath, playCount, updatedAt);
				return track;
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

				var id = trackData._id;
				var name = trackData.name;
				var nameKey = trackData.nameKey;
				var album = trackData.album;
				var discNum = trackData.discNum;
				var trackNum = trackData.trackNum;
				var genre = trackData.genre;
				var length = trackData.length;
				var filePath = trackData.filePath;
				var playCount = trackData.playCount;
				var updatedAt = trackData.updatedAt;
				var track = new Track(id, name, nameKey, album, discNum, trackNum, genre, length, filePath, playCount, updatedAt);
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
					var id = trackData._id;
					var name = trackData.name;
					var nameKey = trackData.nameKey;
					var album = trackData.album;
					var discNum = trackData.discNum;
					var trackNum = trackData.trackNum;
					var genre = trackData.genre;
					var length = trackData.length;
					var filePath = trackData.filePath;
					var playCount = trackData.playCount;
					var updatedAt = trackData.updatedAt;
					var track = new Track(id, name, nameKey, album, discNum, trackNum, genre, length, filePath, playCount, updatedAt);
					tracks.push(track);
				}

				return tracks;
			})
			.catch((error: Response) => Observable.throw(error.json()));
	}

	loadRecentlyPlayed()
	{
		return this.http.get('http://bwilbur.com/tracks/recent')
			.map((response: Response) => {
				const data = response.json().tracks;

				let tracks: Track[] = [];
				for (let trackData of data)
				{
					var id = trackData._id;
					var name = trackData.name;
					var nameKey = trackData.nameKey;
					var album = trackData.album;
					var discNum = trackData.discNum;
					var trackNum = trackData.trackNum;
					var genre = trackData.genre;
					var length = trackData.length;
					var filePath = trackData.filePath;
					var playCount = trackData.playCount;
					var updatedAt = trackData.updatedAt;
					var track = new Track(id, name, nameKey, album, discNum, trackNum, genre, length, filePath, playCount, updatedAt);
					tracks.push(track);
				}
				this.tracks = tracks;
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
					var id = trackData._id;
					var name = trackData.name;
					var nameKey = trackData.nameKey;
					var album = trackData.album;
					var discNum = trackData.discNum;
					var trackNum = trackData.trackNum;
					var genre = trackData.genre;
					var length = trackData.length;
					var filePath = trackData.filePath;
					var playCount = trackData.playCount;
					var updatedAt = trackData.updatedAt;
					var track = new Track(id, name, nameKey, album, discNum, trackNum, genre, length, filePath, playCount, updatedAt);
					tracks.push(track);
				}
				this.tracks = tracks;
				return tracks;
			})
			.catch((error: Response) => Observable.throw(error.json()));
	}
}
