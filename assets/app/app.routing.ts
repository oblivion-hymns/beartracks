import { Routes, RouterModule } from '@angular/router';

import { ArtistsComponent } from './artists/artists.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JukeboxComponent } from './jukebox/jukebox.component';
import { ProfileComponent } from './user/profile.component';
import { RadioComponent } from './radio/radio.component';
import { SearchComponent } from './search/search.component';
import { SignupComponent } from './user/signup.component';

const APP_ROUTES: Routes = [
	{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
	{ path: 'profile', component: ProfileComponent },
	{ path: 'signup', component: SignupComponent },
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'search', component: SearchComponent },
	{ path: 'artists', component: ArtistsComponent },
	{ path: 'radio', component: RadioComponent },
	{ path: 'jukebox', component: JukeboxComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
