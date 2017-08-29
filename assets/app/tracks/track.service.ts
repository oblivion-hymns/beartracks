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
	 * Returns a blob for the given track.
	 * Used as a workaround because onCanPlayThrough() is shit. -_-
	 * @param string track - Path to a track to blobbify
	 */
	loadTrack(track)
	{
		var options = {responseType: ResponseContentType.Blob};
		return this.http.get('http://bwilbur.com:3000/' + track, options).map((response: Response) => {
			return response.blob();
		});
	}

	/**
	 * Loads and returns a random track
	 */
	loadRelated(track, degree)
	{
		var id = track._id;
		return this.http.get('http://bwilbur.com/tracks/related?trackId=' + id + '&degree=' + degree)
			.map(this.mapSingleTrackData)
			.catch((error: Response) => Observable.throw(error.json()));
	}

	/**
	 * Loads and returns a random track in one of the genres related to the provided one
	 * @param String genre
	 * @param Number degree
	 */
	loadRelatedByGenre(genre, degree)
	{
		return this.http.get('http://bwilbur.com/tracks/related?genre=' + genre + '&degree=' + degree)
			.map(this.mapSingleTrackData)
			.catch((error: Response) => Observable.throw(error.json()));
	}

	/**
	 * Loads a random song in the given genre
	 * @param String genre
	 * @return Track
	 */
	loadByGenre(genre)
	{
		return this.http.get('http://bwilbur.com/tracks/random-genre?genre=' + genre)
			.map(this.mapSingleTrackData)
			.catch((error: Response) => Observable.throw(error.json()));
	}

	/**
	 * Loads and returns a random track
	 */
	loadRandom()
	{
		return this.http.get('http://bwilbur.com/tracks/random')
			.map(this.mapSingleTrackData)
			.catch((error: Response) => Observable.throw(error.json()));
	}

	/**
	 * Loads and returns a list of tracks for the given album
	 */
	loadForAlbum(albumId)
	{
		const body = JSON.stringify({albumId: albumId});
		const headers = new Headers({'Content-Type': 'application/json'});

		return this.http.post('http://bwilbur.com/tracks/album', body, {headers: headers})
			.map(this.mapTrackData)
			.catch((error: Response) => Observable.throw(error.json()));
	}

	/**
	 * Loads and returns a shuffled list of all tracks for the given artist
	 */
	loadForArtist(artistId)
	{
		return this.http.get('http://bwilbur.com/tracks/artist?artistId=' + artistId)
			.map(this.mapTrackData)
			.catch((error: Response) => Observable.throw(error.json()));
	}

	/**
	 * Returns a list of recently-played tracks
	 */
	loadRecentlyPlayed()
	{
		return this.http.get('http://bwilbur.com/tracks/recent')
			.map(this.mapTrackData)
			.catch((error: Response) => Observable.throw(error.json()));
	}

	/**
	 * Returns a list of recently-recommended tracks
	 */
	loadRecentlyRecommended()
	{
		return this.http.get('http://bwilbur.com/tracks/recommended')
			.map(this.mapTrackData)
			.catch((error: Response) => Observable.throw(error.json()));
	}

	/**
	 * Finds tracks based on the given query
	 */
	find(query)
	{
		var getUrl = 'http://bwilbur.com/tracks/find?query=' + query;
		return this.http.get(getUrl)
			.map(this.mapTrackData)
			.catch((error: Response) => Observable.throw(error.json()));
	}

	/**
	 * Returns the complete genre map
	 */
	loadGenres()
	{
		return this.http.get('http://bwilbur.com/tracks/genre-map')
			.map((response: Response) => {
				const genres = response.json().genres;
				return genres;
			})
			.catch((error: Response) => Observable.throw(error.json()));
	}

	/**
	 * Recommends the given track
	 * @param Track track
	 */
	recommendTrack(track)
	{
		return this.http.post('http://bwilbur.com/tracks/recommend?trackId=' + track._id, {})
			.map((response: Response) => {
				const genres = response.json().genres;
				return genres;
			})
			.catch((error: Response) => Observable.throw(error.json()));
	}

	/**
	 * Maps a response to a single track
	 * @return Track
	 */
	mapSingleTrackData(response)
	{
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
	}

	/**
	 * Maps a response to an array of tracks
	 * @return Track[]
	 */
	mapTrackData(response)
	{
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
	}
}
