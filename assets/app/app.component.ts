import { Component } from '@angular/core';

import { MessageService } from './messages/message.service';

@Component({
	providers: [MessageService],
	selector: 'my-app',
	styleUrls: ['./app.component.css'],
	templateUrl: './app.component.html'
})
export class AppComponent {

}
