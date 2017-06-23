export class Message {
	content: string;
	username: string;
	id?: string;
	userId?: string;

	constructor(content: string, username: string, id?: string, userId?: string) {
		this.content = content;
		this.username = username;
		this.id = id;
		this.userId = userId;
	}
}
