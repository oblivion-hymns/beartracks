import { Artist } from '../artists/artist';

export class Album {
	constructor(public _id,
				public name: string,
				public nameKey: string,
				public year: string,
				public artist: Artist,
				public imagePath?: string) {}
}
