import { Component } from '@angular/core';

import { MessageService } from './messages/message.service';

@Component({
	providers: [MessageService],
	selector: 'my-app',
	styles: [`
		#PageContent {
			padding: 50px;
		}

		md-toolbar {
			background-color: rgb(40, 40, 40);
		}

		[md-button] {
			text-transform: lowercase;
		}

		md-toolbar [md-button] {
			color: rgba(255, 255, 255, 0.54);
			height: 100%;
			padding: 16px 32px;
			width: 16%;
		}

		md-sidenav-container {
			background-color: rgb(27, 27, 27);
			height: 100%;
		}

		md-sidenav {
			padding: 8px;
			width: 256px;
		}

		md-sidenav button {
			display: inline-block;
			text-align: left;
			width: 100%;
		}

		md-sidenav button md-icon {
			margin-right: 6px;
		}
	`],
	templateUrl: './app.component.html'
})
export class AppComponent {

}
