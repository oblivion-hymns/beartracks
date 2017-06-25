//Basic
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { routing } from './app.routing';
import { HttpModule } from '@angular/http';

//Material
import 'hammerjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { MdButtonModule, MdCardModule, MdCheckboxModule, MdGridListModule, MdIconModule,
		MdMenuModule, MdSidenavModule, MdTabsModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

//App-specific
import { DashboardComponent } from './dashboard/dashboard.component';
import { ArtistsComponent } from './artists/artists.component';
import { AlbumsComponent } from './albums/albums.component';
import { RadioComponent } from './radio/radio.component';
import { DiscoveryComponent } from './discovery/discovery.component';
import { JukeboxComponent } from './jukebox/jukebox.component';

//decorator
@NgModule({
	declarations: [
		AppComponent,

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
		MdSidenavModule,
		MdTabsModule
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule {

}
