export class Message {
	constructor(public text: string,
				public username: string,
				public dateTime?: Date,
				public system?: boolean) {}
}
