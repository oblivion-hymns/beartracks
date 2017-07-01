import { Component } from '@angular/core';

import { Album } from './album';
import { AlbumService } from './album.service';

@Component({
	providers: [AlbumService],
	selector: 'bt-albums',
	styles: [`
		#AlbumsToolbar {
			background-color: rgba(0, 0, 0, 0.54);
			border-radius: 3px;
			padding: 12px;
			position: fixed;
			right: 0px;
			top: 96px;
			z-index: 5;
		}

		#FilterAlbums input {
			color: rgba(255, 255, 255, 0.54);
		}
	`],
	templateUrl: './albums.component.html'
})
export class AlbumsComponent {

}
