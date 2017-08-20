import { Component } from '@angular/core';
import { Track } from './../tracks/track';
import { TrackService } from './../tracks/track.service';

@Component({
	providers: [TrackService],
	selector: 'bt-genres',
	templateUrl: './genres.component.html'
})
export class GenresComponent
{
	private genres: string[] = [];

	constructor(private trackService: TrackService) {}
}
