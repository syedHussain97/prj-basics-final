import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  private storeSub: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe(authState => {
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

    // let authObs: Observable<AuthResponseData>;


    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({
          email: email,
          password: password
        }
      ));
      // authObs = this.authService.login(email, password);

    } else {
      // authObs = this.authService.signUp(email, password);
      this.store.dispatch(new AuthActions.SignupStart({
        email: email,
        password: password
      }));
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

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError());
  }

  ngOnDestroy() {
    if (this.storeSub) {

      this.storeSub.unsubscribe();
    }
  }
}
