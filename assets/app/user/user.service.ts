import 'rxjs/Rx';
import { Http, Headers, Response } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { User } from './user';

@Injectable()
export class UserService
{
	constructor(private http: Http) {}

	signup(user: User)
	{
		const body = JSON.stringify(user);
		const headers = new Headers({'Content-Type': 'application/json'});
		return this.http.post('http://69.113.11.164/user/create', body, {headers: headers})
						.map((response: Response) => response.json())
						.catch((error: Response) => {return Observable.throw(error)});
	}

	login(user: User)
	{
		const body = JSON.stringify(user);
		const headers = new Headers({'Content-Type': 'application/json'});
		return this.http.post('http://69.113.11.164/user/login', body, {headers: headers})
						.map((response: Response) => response.json())
						.catch((error: Response) => {return Observable.throw(error)});
	}

	changePassword(userId: string, currentPass: string, newPass: string, newPassVerify: string)
	{
		const body = JSON.stringify({
			userId: userId,
			currentPassword: currentPass,
			newPassword: newPass,
			newPasswordVerify: newPassVerify
		});
		const headers = new Headers({'Content-Type': 'application/json'});
		return this.http.post('http://69.113.11.164/user/change-password', body, {headers: headers})
						.map((response: Response) => response.json())
						.catch((error: Response) => {return Observable.throw(error)});
	}

	getLoggedInUser()
	{
		var userId = localStorage.getItem('userId');
		var body = JSON.stringify({userId: userId});
		const headers = new Headers({'Content-Type': 'application/json'});
		return this.http.post('http://69.113.11.164/user/load', body, {headers: headers})
						.map((response: Response) => response.json())
						.catch((error: Response) => {return Observable.throw(error)});
	}

	isLoggedIn()
	{
		return localStorage.getItem('token') !== null;
	}

	logout()
	{
		localStorage.clear();
	}
}
