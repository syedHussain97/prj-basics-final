import {Action} from '@ngrx/store';

export const LOGIN_START = '[Auth] AuthenticateSuccess Start';
export const AUTHENTICATE_SUCCESS = '[Auth] AuthenticateSuccess';
export const AUTHENTICATE_FAILURE = '[Auth] AuthenticateSuccess Fail';
export const LOGOUT = '[Auth] Logout';
export const SIGNUP_START = '[Auth] Signup Start';
export const CLEAR_ERROR = '[Auth] Clear error';
export const AUTO_LOGIN = '[Auth] Auto Login';

export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;

  constructor(
    public payload: {
      email: string,
      userId: string,
      token: string,
      expirationDate: Date
    }) {
  }
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: { email: string, password: string }) {
  }
}

export class AuthenticateFailure implements Action {
  readonly type = AUTHENTICATE_FAILURE;

  constructor(public payload: string) {
  }
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;

  constructor(public payload: { email: string, password: string }) {
  }
}

export class ClearError implements Action {
  readonly type = CLEAR_ERROR;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export type AuthActions =
  | AuthenticateSuccess
  | Logout
  | LoginStart
  | AuthenticateFailure
  | SignupStart
  | ClearError
  | AutoLogin;
