import 'rxjs/Rx';
import { AfterViewChecked, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { Album } from './../albums/album';
import { AlbumService } from './../albums/album.service';
import { Artist } from './../artists/artist';
import { ArtistService } from './../artists/artist.service';
import { JukeboxService } from './jukebox.service';
import { Track } from './../tracks/track';
import { TrackService } from './../tracks/track.service';
import { Message } from './message';

@Component({
	providers: [JukeboxService, ArtistService, AlbumService, TrackService],
	selector: 'bt-jukebox',
	styles: [`
		#JukeboxSearch, #SearchResults, #JukeboxQueue
		{
			width: 50%;
		}

		#JukeboxSearch
		{
			padding-bottom: 0px;
			height: 64px;
		}

		.item-line
		{
			margin: 8px;
			overflow: hidden;
		}

		.item-line:hover
		{
			background-color: rgba(40, 40, 40, 0.87);
			cursor: pointer;
		}

		.item-line img
		{
			float: left;
			height: 48px;
			margin-right: 10px;
			width: 48px;
		}

		.item-line .item-text
		{
			display: block;
			line-height: 24px;
			margin-top: 0;
			white-space: normal;
		}

		.item-line .item-text-single
		{
			display: block;
			line-height: 24px;
			text-overflow: ellipsis;
			overflow-x: hidden;
		}

		.item-line .item-text-single.item-text-description
		{
			color: rgba(255, 255, 255, 0.34);
		}





		#JukeboxChat
		{
			background-color: none;
			border-left: 1px solid rgba(0, 0, 0, 0.87);
			border-radius: 5px 0px 0px 0px;
			box-sizing: border-box;
			display: block;
			height: calc(100% - 64px);
			overflow-y: hidden;
			position: absolute;
			right: 0px;
			top: 64px;
			width: 50%;
		}

		#JukeboxChat #Messages
		{
			background-color: rgba(0, 0, 0, 0.38);
			border: 1px solid rgba(0, 0, 0, 0.38);
			border-radius: 2px;
			box-sizing: border-box;
			box-shadow: inset 1px 1px 2px 2px rgba(0, 0, 0, 0.20);
			height: 90%;
			overflow-y: scroll;
			padding: 0px;
		}

		::-webkit-scrollbar
		{
			width: 8px;
		}

		::-webkit-scrollbar-track {
			background-color: rgba(60, 60, 60, 0.87);
			border-radius: 10px;
		}

		::-webkit-scrollbar-thumb {
			border-radius: 5px;
			-webkit-box-shadow: inset 0 0 6px rgba(25, 25, 25, 0.87);
		}

		#JukeboxChat #Messages .message-item
		{
			margin-bottom: 4px;
			padding: 12px;
		}

		#JukeboxChat #Messages .message-item:nth-child(odd)
		{
			background-color: rgba(0, 0, 0, 0.12);
		}

		#JukeboxChat #Messages .message-item.message-item-system
		{
			background-color: rgba(255, 255, 255, 0.1);
		}

		#JukeboxChat #Messages .message-item-username
		{
			color: rgba(255, 255, 255, 0.54);
		}

		#JukeboxChat #Messages .message-item-text
		{
			color: rgba(255, 255, 255, 0.87);
		}

		#JukeboxChat #Messages .message-item-date
		{
			color: rgba(255, 255, 255, 0.36);
			float: right;
			font-size: 12px;
		}

		#JukeboxChat #Send
		{
			height: 6%;
			box-sizing: border-box;
		}

		.greentext
		{
			color: rgba(155, 163, 80, 0.87) !important;
		}
	`],
	templateUrl: './jukebox.component.html'
})
export class JukeboxComponent implements OnInit, AfterViewChecked
{
	albums: Album[] = [];
	tracks: Track[] = [];
	albumsLoading: boolean = false;
	tracksLoading: boolean = false;
	@Input() filterQuery: string = '';

	@Input() message: string = '';
	@ViewChild('chat') input;
	username: string = 'User ' + (Math.floor(Math.random() * (1000000 - 0) + 0));


	constructor(private jukeboxService: JukeboxService,
		private artistService: ArtistService,
		private albumService: AlbumService,
		private trackService: TrackService)
	{

	}



	ngOnInit()
	{
		this.jukeboxService.join(this.username);
	}

	ngAfterViewChecked()
	{
		this.scrollChat();
	}

	ngAfterViewInit()
	{
		this.input.nativeElement.scrollTop = 500;
	}

	/**
	 * Searching for artists, albums & tracks
	 */
	set filterString(value)
	{
		var self = this;
		var key = value.trim();

		if (key.length > 2)
		{
			this.albumsLoading = true;
			this.tracksLoading = true;

			this.albumService.find(key).subscribe(function(albums){
				self.albums = albums;
				self.albumsLoading = false;
			});

			this.trackService.find(key).subscribe(function(tracks){
				self.tracks = tracks;
				self.tracksLoading = false;
			});
		}

		this.filterQuery = key;
	}

	set setMessage(value)
	{
		this.message = value;
	}

	get setMessage()
	{
		return this.message;
	}

	scrollChat()
	{
		this.input.nativeElement.scrollTop = this.input.nativeElement.scrollHeight;
	}

	/**
	 * Sends the provided message
	 */
	sendMessage()
	{
		this.message = this.message.trim();
		if (this.message.length > 0)
		{
			var message = new Message(this.message, this.username);
			this.jukeboxService.postMessage(message);
			this.message = '';

			message.dateTime = new Date();
		}
	}
}
