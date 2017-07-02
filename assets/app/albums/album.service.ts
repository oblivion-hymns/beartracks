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
				console.log(response.json());

				let albums: Album[] = [];
				for (let albumData of data)
				{
					var name = albumData.name;
					var nameKey = albumData.nameKey;
					var year = albumData.year;
					var artist = albumData.artist;
					var imagePath = albumData.imagePath;
					imagePath = encodeURI(imagePath);

					console.log(imagePath);

					var album = new Album(name, nameKey, year, artist, imagePath);
					albums.push(album);
				}
				this.albums = albums;
				return albums;
			})
			.catch((error: Response) => Observable.throw(error.json()));
	}
}
