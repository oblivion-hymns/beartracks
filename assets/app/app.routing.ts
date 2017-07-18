import { Routes, RouterModule } from '@angular/router';

import { AlbumsComponent } from './albums/albums.component';
import { ArtistsComponent } from './artists/artists.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DiscoveryComponent } from './discovery/discovery.component';
import { JukeboxComponent } from './jukebox/jukebox.component';
import { LoginComponent } from './user/login.component';
import { RadioComponent } from './radio/radio.component';
import { SearchComponent } from './search/search.component';
import { SignupComponent } from './user/signup.component';

const APP_ROUTES: Routes = [
	{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'signup', component: SignupComponent },
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'search', component: SearchComponent },
	{ path: 'artists', component: ArtistsComponent },
	{ path: 'albums', component: AlbumsComponent },
	{ path: 'radio', component: RadioComponent },
	{ path: 'discovery', component: DiscoveryComponent },
	{ path: 'jukebox', component: JukeboxComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
