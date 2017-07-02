import { Component, Input, OnInit } from '@angular/core';

import { Track } from './track';
import { TrackService } from './track.service';

@Component({
	providers: [TrackService],
	selector: 'bt-tracks',
	styles: [`
		.track-list-item
		{
			cursor: default;
		}

		.track-list-item img
		{
			border: 1px solid rgba(0, 0, 0, 0.54);
			float: left;
			margin-right: 16px;
			width: 64px;
		}

		.track-list-item:hover
		{
			background-color: #222;
		}

		.track-list-item .play-button
		{
			color: rgba(255, 255, 255, 0.54);
			font-size: 32px;
			width: 32px;
			height: 32px;
		}

		.track-list-item .play-button:hover
		{
			color: rgba(255, 255, 255, 0.87);
			cursor: pointer;
		}

		#FilterTracks input {
			color: rgba(255, 255, 255, 0.54);
		}
	=`],
	templateUrl: './tracks.component.html'
})
export class TracksComponent implements OnInit
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
				this.displayTracks = this.tracks.slice();
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
