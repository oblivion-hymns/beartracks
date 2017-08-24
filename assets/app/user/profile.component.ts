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
	loginForm: FormGroup;
	passwordForm: FormGroup;

	errorMessage: string = '';
	successMessage: string = '';
	username: string = '';

	constructor(private router: Router, public userService: UserService) {}

	ngOnInit()
	{
		this.loginForm = new FormGroup({
			username: new FormControl(null, Validators.required),
			password: new FormControl(null, Validators.required)
		});

		this.passwordForm = new FormGroup({
			currentPassword: new FormControl(null, Validators.required),
			newPassword: new FormControl(null, Validators.required),
			newPasswordVerify: new FormControl(null, Validators.required)
		});

		this.userService.getLoggedInUser().subscribe(data => {
			if (data.username)
			{
				this.username = data.username;
			}
		});
	}

	onSubmitLogin()
	{
		var form = this.loginForm.value;
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

	onPasswordChangeSubmit()
	{
		var form = this.passwordForm.value;

		var userId = localStorage.getItem('userId');
		var currentPassword = form.currentPassword;
		var newPassword = form.newPassword;
		var newPasswordVerify = form.newPasswordVerify;

		this.errorMessage = '';
		this.successMessage = '';

		this.userService.changePassword(userId, currentPassword, newPassword, newPasswordVerify).subscribe(
			data => {
				this.successMessage = 'Successfully changed';
				this.passwordForm.reset();
			},
			error => {
				var json = JSON.parse(error._body);
				var errorMessage = json.message;
				this.errorMessage = errorMessage;
				this.passwordForm.reset();
			}
		);
	}
}
