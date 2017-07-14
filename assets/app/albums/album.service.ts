import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/Rx';
import { Observable } from 'rxjs';

import { Artist } from './../artists/artist';
import { Album } from './album';

@Injectable()
export class AlbumService
{
	private albums: Album[] = [];

	constructor(private http: Http) {}

	find(query)
	{
		var getUrl = 'http://bwilbur.com:3000/albums/find?query=' + query;
		return this.http.get(getUrl)
			.map((response: Response) => {
				const data = response.json().albums;

				let albums: Album[] = [];
				for (let albumData of data)
				{
					var _id = albumData._id;
					var name = albumData.name;
					var nameKey = albumData.nameKey;
					var year = albumData.year;
					var artist = albumData.artist;
					var imagePath = albumData.imagePath;
					imagePath = encodeURI(imagePath);

					var album = new Album(_id, name, nameKey, year, artist, imagePath);
					albums.push(album);
				}

				return albums;
			})
			.catch((error: Response) => Observable.throw(error.json()));
	}

	loadForArtist(artist: Artist)
	{
		var url = 'http://bwilbur.com/albums/loadForArtist?artistId=' + artist._id;

		return this.http.get(url)
			.map((response: Response) => {
				const data = response.json().albums;

				let albums: Album[] = [];
				for (let albumData of data)
				{
					var _id = albumData._id;
					var name = albumData.name;
					var nameKey = albumData.nameKey;
					var year = albumData.year;
					var artist = albumData.artist;
					var imagePath = albumData.imagePath;
					imagePath = encodeURI(imagePath);

					var album = new Album(_id, name, nameKey, year, artist, imagePath);
					albums.push(album);
				}
				this.albums = albums;
				return albums;
			})
			.catch((error: Response) => Observable.throw(error.json()));
	}

	loadAll()
	{
		return this.http.get('http://bwilbur.com/albums/all')
			.map((response: Response) => {
				const data = response.json().albums;

				let albums: Album[] = [];
				for (let albumData of data)
				{
					var _id = albumData._id;
					var name = albumData.name;
					var nameKey = albumData.nameKey;
					var year = albumData.year;
					var artist = albumData.artist;
					var imagePath = albumData.imagePath;
					imagePath = encodeURI(imagePath);

					var album = new Album(_id, name, nameKey, year, artist, imagePath);
					albums.push(album);
				}
				this.albums = albums;
				return albums;
			})
			.catch((error: Response) => Observable.throw(error.json()));
	}
}
