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
		return this.http.post('http://localhost:3000/user/create', body, {headers: headers})
						.map((response: Response) => response.json())
						.catch((error: Response) => {return Observable.throw(error);});
	}

	login(user: User)
	{
		const body = JSON.stringify(user);
		const headers = new Headers({'Content-Type': 'application/json'});
		return this.http.post('http://localhost:3000/user/login', body, {headers: headers})
						.map((response: Response) => response.json())
						.catch((error: Response) => {return Observable.throw(error);});
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
