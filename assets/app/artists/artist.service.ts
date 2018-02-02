import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/Rx';
import { Observable } from 'rxjs';

import { Artist } from './artist';

@Injectable()
export class ArtistService {

	private artists: Artist[] = [];

	constructor(private http: Http) {}

	find(query)
	{
		var getUrl = 'http://69.113.11.164/artists/find?query=' + query;
		return this.http.get(getUrl)
			.map((response: Response) => {
				const data = response.json().artists;

				let artists: Artist[] = [];
				for (let artistData of data)
				{
					var artist = new Artist(artistData._id, artistData.name, artistData.nameKey, artistData.imagePath);
					artists.push(artist);
				}
				this.artists = artists;
				return artists;
			})
			.catch((error: Response) => Observable.throw(error.json()));
	}

	loadAll()
	{
		return this.http.get('http://69.113.11.164/artists/all')
			.map((response: Response) => {
				const data = response.json().artists;

				let artists: Artist[] = [];
				for (let artistData of data)
				{
					var artist = new Artist(artistData._id, artistData.name, artistData.nameKey, artistData.imagePath);
					artists.push(artist);
				}
				this.artists = artists;
				return artists;
			})
			.catch((error: Response) => Observable.throw(error.json()));
	}
}
