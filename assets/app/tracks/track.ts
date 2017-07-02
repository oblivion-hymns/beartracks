import { Album } from '../albums/album';

export class Track
{
	constructor(public name: string,
				public nameKey: string,
				public album: Album,
				public discNum: number,
				public trackNum: number,
				public genre: string,
				public length: string) {}
}
