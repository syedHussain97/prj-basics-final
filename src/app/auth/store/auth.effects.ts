import {Actions, Effect, ofType} from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (expiresIn: number, email, userId, token) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  return new AuthActions.AuthenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate
  });

};

const handleError = (errorResponse: any) => {

  let errorMessage = 'an error has occurred';
  if (!errorResponse.error || !errorResponse.error.error) {
    return of(new AuthActions.AuthenticateFailure(errorMessage));
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
  return of(new AuthActions.AuthenticateFailure(errorMessage));

};

@Injectable()
export class AuthEffects {

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupActions: AuthActions.SignupStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA956rt-7X0_QawXvPM48Lc2q8yv-FRHk0',
        {
          email: signupActions.payload.email,
          password: signupActions.payload.password,
          returnSecureToken: true
        }).pipe(
        map(resData => handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)),
        catchError(errorResponse => {

          return handleError(errorResponse);
        }),
      );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA956rt-7X0_QawXvPM48Lc2q8yv-FRHk0', {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }).pipe(
        map(resData => {
          return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
        }),
        catchError(responseError => {
          return handleError(responseError);
        }),
      );
    })
  );

  @Effect({dispatch: false})
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS, AuthActions.LOGOUT),
    tap(() => this.router.navigate(['/'])));


  constructor(private actions$: Actions,
              private http: HttpClient,
              private router: Router) {
  }
}
