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

@Injectable()
export class AuthEffects {

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupActions: AuthActions.SignupStart))
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
        map(responseData => {
            const expirationDate = new Date(new Date().getTime() + +responseData.expiresIn * 1000);
            return new AuthActions.AuthenticateSuccess({
              email: responseData.email,
              userId: responseData.localId,
              token: responseData.idToken,
              expirationDate: expirationDate
            });
          }
        ),
        catchError(errorResponse => {

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
        }),
      );
    })
  );

  @Effect({dispatch: false})
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap(() => this.router.navigate(['/'])));


  constructor(private actions$: Actions,
              private http: HttpClient,
              private router: Router) {
  }
}
