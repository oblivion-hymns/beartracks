import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header.component';
import { routing } from './app.routing';

import { MaterialModule } from '@angular/material';
import 'hammerjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdButtonModule, MdCheckboxModule, MdIconModule, MdMenuModule, MdSidenavModule } from '@angular/material';

import { AuthenticationComponent } from './auth/authentication.component';

import { MessagesComponent } from './messages/messages.component';
import { MessageComponent } from './messages/message.component';
import { MessageListComponent } from './messages/message-list.component';
import { MessageInputComponent } from './messages/message-input.component';

//decorator
@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,

		AuthenticationComponent,

		MessageComponent,
		MessageListComponent,
		MessageInputComponent,
		MessagesComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		routing,

		MaterialModule,
		BrowserAnimationsModule,
		MdButtonModule,
		MdCheckboxModule,
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
