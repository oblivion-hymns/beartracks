import { Component, Input, OnInit } from '@angular/core';

import { Track } from './track';
import { TrackService } from './track.service';

@Component({
	providers: [TrackService],
	selector: 'bt-albums',
	styles: [`
		#TracksToolbar {
			background-color: rgba(0, 0, 0, 0.54);
			border-radius: 3px;
			padding: 12px;
			position: fixed;
			right: 0px;
			top: 96px;
			z-index: 5;
		}

		#FilterTracks input {
			color: rgba(255, 255, 255, 0.54);
		}
	=`],
	templateUrl: './tracks.component.html'
})
export class TracksComponent
{
	tracks: Track[] = [];
	displayTracks: Track[] = [];

	@Input() filterQuery = '';

	constructor(private trackService: TrackService) {}

	ngOnInit()
	{
		this.trackService.loadAll().subscribe(
			(tracks: Track[]) => {
				this.tracks = tracks;
				console.log(tracks);
				this.displayTracks = tracks.slice();
			}
		)
	}

	set filterString(value)
	{
		this.displayTracks = this.tracks.slice();

		if (value)
		{
			value = value.toLowerCase();
			this.displayTracks = this.displayTracks.filter(
				track => track.nameKey.includes(value.replace(/ /g, ''))
			);
		}
	}

	filterTracks(query)
	{
		this.filterQuery = query;
	}
}
