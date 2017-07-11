//Basic
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { routing } from './app.routing';
import { HttpModule } from '@angular/http';
import { SocketIoModule, SocketIoConfig } from 'ng2-socket-io';

//Material
import 'hammerjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { MdButtonModule, MdCardModule, MdCheckboxModule, MdGridListModule, MdIconModule,
		MdMenuModule, MdProgressBarModule, MdSidenavModule, MdTabsModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

//App-specific
import { PlayerComponent } from './player/player.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SearchComponent } from './search/search.component';
import { ArtistsComponent } from './artists/artists.component';
import { AlbumsComponent } from './albums/albums.component';
import { RadioComponent } from './radio/radio.component';
import { DiscoveryComponent } from './discovery/discovery.component';
import { JukeboxComponent } from './jukebox/jukebox.component';

const socketIoConfig: SocketIoConfig = {
	url: 'http://localhost:8988',
	options: {}
};

//decorator
@NgModule({
	declarations: [
		AppComponent,

		PlayerComponent,
		SearchComponent,
		DashboardComponent,
		ArtistsComponent,
		AlbumsComponent,
		RadioComponent,
		DiscoveryComponent,
		JukeboxComponent
	],
	imports: [
		BrowserModule,
		FlexLayoutModule,
		FormsModule,
		routing,
		HttpModule,

		MaterialModule,
		BrowserAnimationsModule,
		MdButtonModule,
		MdCardModule,
		MdCheckboxModule,
		MdGridListModule,
		MdIconModule,
		MdMenuModule,
		MdProgressBarModule,
		MdSidenavModule,
		MdTabsModule
	],
	providers: [],
	bootstrap: [
		AppComponent
	]
})
export class AppModule {

}
