import { Routes, RouterModule } from '@angular/router';
import { ArtistsComponent } from './artists/artists.component';
import { AlbumsComponent } from './albums/albums.component';

const APP_ROUTES: Routes = [
	{ path: '', redirectTo: '/artists', pathMatch: 'full' },
	{ path: 'artists', component: ArtistsComponent },
	{ path: 'albums', component: AlbumsComponent },
];

export const routing = RouterModule.forRoot(APP_ROUTES);
