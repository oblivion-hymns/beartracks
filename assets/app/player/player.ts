import { Artist } from '../artists/artist';
import { Album } from '../albums/album';
import { Track } from '../tracks/track';

export class Player
{
	public isPlaying: boolean;

	public currentTrack: Track;
	public currentAlbum: Album;
	public currentArtist: Artist;
	public queue;

	constructor(){ }
}
