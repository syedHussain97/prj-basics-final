import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthResponseData, AuthService} from './auth.service';
import {Observable} from "rxjs";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;

  }

  onSubmitMethod(form: NgForm) {
    console.log(form.value);
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;

    let authObs: Observable<AuthResponseData>;


    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);

    } else {
      authObs = this.authService.signUp(email, password);
    }

    authObs.subscribe(responseData => {
      console.log(responseData);
      this.isLoading = false;
    }, errorMessage => {
      console.log(errorMessage);
      this.error = errorMessage;
      this.isLoading = false;
    });

    form.reset();
  }
}
