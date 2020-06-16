import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';


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

  constructor(private http: HttpClient) {
  }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA956rt-7X0_QawXvPM48Lc2q8yv-FRHk0',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(catchError(errorResponse => {
      let errorMessage = 'an error has occurred';
      if (!errorResponse.error || !errorResponse.error.error) {

      } else {

        switch (errorResponse.error.error.message) {
          case 'EMAIL_EXISTS':
            errorMessage = 'This email already exists';
        }
      }
      return throwError(errorMessage);
    }));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA956rt-7X0_QawXvPM48Lc2q8yv-FRHk0', {
        email: email,
        password: password,
        returnSecureToken: true
      });
  }

}
