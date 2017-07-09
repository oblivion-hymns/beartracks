import { Component, ElementRef, Input, OnInit, NgZone } from '@angular/core';

import { PlayerService } from '../player/player.service';
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

		.track-list-item-name
		{
			display: block;
			font-size: 2vmin;
			margin-bottom: 0.8vmin;
			margin-top: 1.8vmin;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.track-list-item-name.track-list-item-name-mobile
		{
			font-size: 3vmin;
			margin-bottom: 1.4vmin;
			margin-top: 2.3vmin;
		}

		.track-list-item-sub
		{
			color: rgba(255, 255, 255, 0.38);
		}

		.track-list-item-sub
		{
			font-size: 2vmin;
			margin-bottom: 0.8vmin;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.track-list-item-sub.track-list-item-sub-mobile
		{
			font-size: 3vmin;
			margin-bottom: 1.1vmin;
		}

		.track-list-item img
		{
			border: 1px solid rgba(0, 0, 0, 0.54);
			float: left;
			margin-right: 16px;
			width: 64px;
		}

		.track-list-item img.track-list-item-image
		{
			height: 8vmin;
			margin-top: 0.6vmin;
			width: 8vmin;
		}

		.track-list-item img.track-list-item-image-mobile
		{
			height: 12vmin;
			margin-top: 0.6vmin;
			width: 12vmin;
		}

		.track-list-item:hover
		{
			background-color: #222;
		}

		.track-list-item .play-button
		{
			color: rgba(255, 255, 255, 0.54);
			float: left;
			font-size: 8vmin;
			height: 8vmin;
			margin-top: 0.6vmin;
			position: absolute;
			width: 8vmin;
		}

		.track-list-item .play-button.play-button-mobile
		{
			float: left;
			font-size: 12vmin;
			height: 12vmin;
			margin-top: 0.6vmin;
			position: absolute;
			width: 12vmin;
		}

		.track-list-item .play-button:hover
		{
			color: rgba(255, 255, 255, 0.87);
			cursor: pointer;
		}

		ul
		{
			list-style-type: none;
		}

		#FilterTracks input
		{
			color: rgba(255, 255, 255, 0.54);
		}
	`],
	templateUrl: './tracks.component.html'
})
export class TracksComponent implements OnInit
{
	tracks: Track[] = [];
	displayTracks: Track[] = [];

	@Input() filterQuery = '';

	constructor(private trackService: TrackService, private playerService: PlayerService){}

	ngOnInit()
	{
		this.trackService.loadAll().subscribe(
			(tracks: Track[]) => { this.tracks = tracks; }
		)
	}

	set filterString(value)
	{
		this.displayTracks = [];

		value = value.trim().toLowerCase().replace(/\W/g, '');
		if (value && value.length > 2)
		{
			this.displayTracks = this.displayTracks.filter(
				track => track.nameKey.includes(value));
		}

		this.filterQuery = value;
	}

	filterTracks(query)
	{
		this.filterQuery = query;
	}
}
