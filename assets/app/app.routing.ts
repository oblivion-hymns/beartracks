import { Routes, RouterModule } from '@angular/router';
import { ArtistsComponent } from './artists/artists.component';

const APP_ROUTES: Routes = [
	{ path: '', redirectTo: '/artists', pathMatch: 'full' },
	{ path: 'artists', component: ArtistsComponent },
];

export const routing = RouterModule.forRoot(APP_ROUTES);
