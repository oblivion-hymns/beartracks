import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/Rx';
import { Observable } from 'rxjs';

import { Artist } from './artist';

@Injectable()
export class ArtistService {

	private artists: Artist[] = [];

	constructor(private http: Http) {}

	loadAll()
	{
		return this.http.get('http://bwilbur.com/artists/all')
			.map((response: Response) => {
				const data = response.json().artists;

				let artists: Artist[] = [];
				for (let artistData of data)
				{
					var artist = new Artist(artistData.name, artistData.nameKey, artistData.imagePath);
					artists.push(artist);
				}
				this.artists = artists;
				return artists;
			})
			.catch((error: Response) => Observable.throw(error.json()));
	}
}
