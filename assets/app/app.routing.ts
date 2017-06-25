import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ArtistsComponent } from './artists/artists.component';
import { AlbumsComponent } from './albums/albums.component';
import { RadioComponent } from './radio/radio.component';
import { DiscoveryComponent } from './discovery/discovery.component';
import { JukeboxComponent } from './jukebox/jukebox.component';

const APP_ROUTES: Routes = [
	{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'artists', component: ArtistsComponent },
	{ path: 'albums', component: AlbumsComponent },
	{ path: 'radio', component: RadioComponent },
	{ path: 'discovery', component: DiscoveryComponent },
	{ path: 'jukebox', component: JukeboxComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
