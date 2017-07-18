import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from './user';
import { UserService } from './user.service';

@Component({
	selector: 'bt-login',
	templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit
{
	form: FormGroup;
	errorMessage: string = '';
	successMessage: string = '';

	constructor(private router: Router, private userService: UserService) {}

	ngOnInit()
	{
		this.form = new FormGroup({
			username: new FormControl(null, Validators.required),
			password: new FormControl(null, Validators.required)
		});
	}

	onSubmit()
	{
		var form = this.form.value;
		var user = new User(form.username, form.password);
		this.errorMessage = '';
		this.successMessage = '';

		this.userService.login(user).subscribe(
			data => {
				localStorage.setItem('token', data.token);
				localStorage.setItem('userId', data.userId);
				localStorage.setItem('username', data.username);
				this.router.navigateByUrl('/');
			},
			error => {
				var json = JSON.parse(error._body);
				var errorMessage = json.message;
				this.errorMessage = errorMessage;
			}
		);
	}
}
