import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from './user';
import { UserService } from './user.service';

@Component({
	selector: 'bt-sign-up',
	templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit
{
	form: FormGroup;

	constructor(private userService: UserService) {}

	ngOnInit()
	{
		this.form = new FormGroup({
			username: new FormControl(null, Validators.required),
			password: new FormControl(null, Validators.required)
		});
	}
}
