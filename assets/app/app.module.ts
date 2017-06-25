//Basic
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { routing } from './app.routing';

//Material
import 'hammerjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { MdButtonModule, MdCheckboxModule, MdGridListModule, MdIconModule, MdMenuModule, MdSidenavModule } from '@angular/material';

//App-specific
import { ArtistsComponent } from './artists/artists.component';

//decorator
@NgModule({
	declarations: [
		AppComponent,

		ArtistsComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		routing,

		MaterialModule,
		BrowserAnimationsModule,
		MdButtonModule,
		MdCheckboxModule,
		MdGridListModule,
		MdIconModule,
		MdMenuModule,
		MdSidenavModule
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule {

}
