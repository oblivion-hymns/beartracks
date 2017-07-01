import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/Rx';
import { Observable } from 'rxjs';

import { Album } from './album';

@Injectable()
export class AlbumService
{
	private albums: Album[] = [];

	constructor(private http: Http) {}

	loadAll()
	{
		return this.http.get('http://bwilbur.com/albums/all')
			.map((response: Response) => {
				const data = response.json().albums;

				let albums: Album[] = [];
				for (let albumData of data)
				{
					var name = albumData.name;
					var nameKey = albumData.nameKey;
					var year = albumData.year;
					var artistId = albumData.artistId;
					var imagePath = albumData.imagePath;

					var album = new Album(name, nameKey, year, artistId, imagePath);
					albums.push(album);
				}
				this.albums = albums;
				return albums;
			})
			.catch((error: Response) => Observable.throw(error.json()));
	}
}
