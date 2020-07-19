import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthResponseData, AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService,
              private router: Router,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;

    });
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
      this.store.dispatch(new AuthActions.LoginStart({
          email: email,
          password: password
        }
      ));
      // authObs = this.authService.login(email, password);

    } else {
      // authObs = this.authService.signUp(email, password);
    }

    this.store.select('auth').subscribe(authState => {

    });


    // authObs.subscribe(responseData => {
    //   console.log(responseData);
    //   this.isLoading = false;
    //   this.router.navigate(['recipes']);
    // }, errorMessage => {
    //   console.log(errorMessage);
    //   this.error = errorMessage;
    //   this.isLoading = false;
    // });

    form.reset();
  }
}
