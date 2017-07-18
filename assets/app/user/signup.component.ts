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
	errorMessage: string = '';
	successMessage: string = '';

	constructor(private userService: UserService) {}

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
		this.userService.signup(user).subscribe(
			data => {
				this.form.reset();
				this.successMessage = 'Saved successfully'
			},
			error => {
				var json = JSON.parse(error._body);
				var errorMessage = json.message;
				this.errorMessage = errorMessage;
			}
		);
	}
}
