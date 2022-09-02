import {Action} from "@ngrx/store";
import {UserInterface} from "../user.model";

export const LOGIN_BEGIN = "[Auth] LOGIN_BEGIN";
export const LOGIN_IN_PROGRESS = "[Auth] LOGIN_IN_PROGRESS";
export const LOGIN_SUCCESS = "[Auth] LOGIN_SUCCESS";
export const LOGOUT = "[Auth] LOGOUT";
export const AUTO_LOGIN = "[Auth] AUTO_LOGIN";
export const AUTO_LOGIN_FINISH = "[Auth] AUTO_LOGIN_FINISH";
export const REFRESH_TOKEN = "[Auth] REFRESH_TOKEN";
export const AUTH_ERROR = "[Auth] AUTH_ERROR";

export class LoginBegin implements Action {
  readonly type = LOGIN_BEGIN;

  constructor(public payload: { email: string, password: string }) {
  }
}

export class LoginInProgress implements Action {
  readonly type = LOGIN_IN_PROGRESS;

  constructor(public payload: { access_token: string; refresh_token: string; id: string; email: string }) {
  }
}

export class LoginSuccess implements Action {
  readonly type = LOGIN_SUCCESS;

  constructor(public payload: { username: string, role: string }) {
  }
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export class AutoLoginFinish implements Action {
  readonly type = AUTO_LOGIN_FINISH;

  constructor(public payload: UserInterface) {
  }
}

export class RefreshToken implements Action {
  readonly type = REFRESH_TOKEN;

  constructor(public payload: { access_token: string }) {
  }
}

export class AuthError implements Action {
  readonly type = AUTH_ERROR;

  constructor(public payload: string ) {
  }
}

export type AuthActions = LoginBegin | LoginInProgress | LoginSuccess | Logout | AutoLogin | AutoLoginFinish
  | RefreshToken | AuthError;
