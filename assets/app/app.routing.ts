import { Routes, RouterModule } from '@angular/router';

import { BrowseComponent } from './browse/browse.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JukeboxComponent } from './jukebox/jukebox.component';
import { ProfileComponent } from './user/profile.component';
import { SearchComponent } from './search/search.component';
import { SignupComponent } from './user/signup.component';

const APP_ROUTES: Routes = [
	{ path: '', redirectTo: '/library', pathMatch: 'full' },
	{ path: 'search', component: SearchComponent },
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'browse', component: BrowseComponent },
	{ path: 'jukebox', component: JukeboxComponent },
	{ path: 'profile', component: ProfileComponent },
	{ path: 'signup', component: SignupComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
