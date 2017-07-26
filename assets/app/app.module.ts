//Basic
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { routing } from './app.routing';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

//Material
import 'hammerjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@angular/material';
import { MdButtonModule, MdCardModule, MdCheckboxModule, MdGridListModule, MdIconModule,
		MdMenuModule, MdProgressBarModule, MdSidenavModule, MdTabsModule } from '@angular/material';

//Plugins
import { AutofocusModule } from 'angular-autofocus-fix';
import { LightboxModule } from 'angular2-lightbox';

//App-specific
import { BrowseComponent } from './browse/browse.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JukeboxComponent } from './jukebox/jukebox.component';
import { PlayerComponent } from './player/player.component';
import { ProfileComponent } from './user/profile.component';
import { RadioComponent } from './radio/radio.component';
import { SearchComponent } from './search/search.component';
import { SignupComponent } from './user/signup.component';

//Services
import { PlayerService } from './player/player.service';
import { UserService } from './user/user.service';

//decorator
@NgModule({
	providers: [PlayerService, UserService],
	declarations: [
		AppComponent,
		BrowseComponent,
		DashboardComponent,
		JukeboxComponent,
		PlayerComponent,
		ProfileComponent,
		RadioComponent,
		SearchComponent,
		SignupComponent
	],
	imports: [
		BrowserModule,
		FlexLayoutModule,
		FormsModule,
		ReactiveFormsModule,
		routing,
		HttpModule,

		AutofocusModule,
		LightboxModule,

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
	bootstrap: [
		AppComponent
	]
})
export class AppModule {

}
