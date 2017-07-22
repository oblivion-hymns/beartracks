import { Album } from '../albums/album';

export class Track
{
	public lengthFormatted: string;

	constructor(public _id: string,
				public name: string,
				public nameKey: string,
				public album: Album,
				public discNum: number,
				public trackNum: number,
				public genre: string,
				public length: string,
				public filePath: string,
				public playCount: string,
				public updatedAt: Date) {
					var tempLength = parseInt(this.length);
					var length_h = null;
					var length_m = null;
					var length_s = null;

					//Hours
					while (tempLength >= 3600)
					{
						length_h += 1;
						tempLength -= 3600;
					}

					//Minutes
					length_m = 0;
					while (tempLength >= 60)
					{
						length_m += 1;
						tempLength -= 60;
					}
					if (length_m == 0)
					{
						length_m = '0';
					}
					else if (length_m < 10 && length_h > 0)
					{
						length_m = '0' + length_m;
					}


					length_s = tempLength;
					if (length_s < 10)
					{
						length_s = '0' + length_s;
					}

					if (length_h > 0)
					{
						this.lengthFormatted = '' + length_h + ':' + length_m + ':' + length_s;
					}
					else
					{
						this.lengthFormatted = '' + length_m + ':' + length_s;
					}
	}
}
