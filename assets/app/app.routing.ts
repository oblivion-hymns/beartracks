import { Routes, RouterModule } from '@angular/router';

import { BrowseComponent } from './browse/browse.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GenresComponent } from './genres/genres.component';
import { SearchComponent } from './search/search.component';

import { JukeboxComponent } from './jukebox/jukebox.component';
import { ProfileComponent } from './user/profile.component';
import { SignupComponent } from './user/signup.component';

const APP_ROUTES: Routes = [
	{ path: '', redirectTo: '/browse', pathMatch: 'full' },
	{ path: 'browse', component: BrowseComponent },
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'genres', component: GenresComponent },
	{ path: 'search', component: SearchComponent },

	//Not used anymore :(
	{ path: 'jukebox', component: JukeboxComponent },
	{ path: 'profile', component: ProfileComponent },
	{ path: 'signup', component: SignupComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
