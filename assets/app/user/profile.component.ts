import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from './user';
import { UserService } from './user.service';

@Component({
	selector: 'bt-profile',
	templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit
{
	form: FormGroup;
	errorMessage: string = '';
	successMessage: string = '';
	username: string = '';

	constructor(private router: Router, private userService: UserService) {}

	ngOnInit()
	{
		this.form = new FormGroup({
			username: new FormControl(null, Validators.required),
			password: new FormControl(null, Validators.required)
		});

		this.userService.getLoggedInUser().subscribe(data => {
			if (data.username)
			{
				this.username = data.username;
			}
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
				this.username = data.username;
				this.router.navigateByUrl('/profile');
			},
			error => {
				var json = JSON.parse(error._body);
				var errorMessage = json.message;
				this.errorMessage = errorMessage;
			}
		);
	}
}
