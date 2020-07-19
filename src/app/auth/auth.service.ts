import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {User} from './user.model';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as authActions from '../auth/store/auth.actions';


export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {

  // user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient,
              private router: Router,
              private store: Store<fromApp.AppState>) {
  }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA956rt-7X0_QawXvPM48Lc2q8yv-FRHk0',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(catchError(this.handleError), tap(responseData => {
      this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
    }));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA956rt-7X0_QawXvPM48Lc2q8yv-FRHk0', {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(
      catchError(this.handleError),
      tap(responseData => {
        this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken,
          +responseData.expiresIn);
      }));
  }

  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    } else {
      const loadedUser =
        new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

      if (loadedUser.token) {
        this.store.dispatch(
          new authActions.AuthenticateSuccess(
            {
              email: loadedUser.id,
              userId: loadedUser.id,
              token: loadedUser.token,
              expirationDate: new Date(userData._tokenExpirationDate)
            }));
        // this.user.next(loadedUser);
        const expirationTimeRemaining = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.autoLogOut(expirationTimeRemaining);
      }

    }
  }

  logOut() {
    // this.user.next(null);
    this.store.dispatch(new authActions.Logout());
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  // argument in milliseconds
  autoLogOut(expirationDuration: number) {
    console.log('expiration duration is ' + expirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      this.logOut();
    }, expirationDuration);

  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {

    const expiresInMilliseconds = expiresIn * 1000;
    const expirationDate = new Date(new Date().getTime() + expiresInMilliseconds);
    const user = new User(email, userId, token, expirationDate);

    // this.user.next(user);

    this.store.dispatch(
      new authActions.AuthenticateSuccess(
        {
          email: email,
          userId: userId,
          token: token,
          expirationDate: expirationDate
        }));

    this.autoLogOut(expiresInMilliseconds);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorResponse: HttpErrorResponse) {

    let errorMessage = 'an error has occurred';
    if (!errorResponse.error || !errorResponse.error.error) {

    } else {

      switch (errorResponse.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = 'This email already exists';
          break;
        case 'EMAIL_NOT_FOUND':
          errorMessage = 'This email doesn not exist';
          break;
        case 'INVALID_PASSWORD':
          errorMessage = 'password is invalid';
          break;
      }
    }
    return throwError(errorMessage);
  }
}
