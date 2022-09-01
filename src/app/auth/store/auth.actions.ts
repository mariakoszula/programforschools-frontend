import {Action} from "@ngrx/store";
import {UserInterface} from "../user.model";

export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const UPDATE = "UPDATE";
export const AUTO_LOGIN = "AUTO_LOGIN";
export const REFRESH_TOKEN = "REFRESH_TOKEN";


export class Login implements Action {
  readonly type = LOGIN;

  constructor(public userPayload: { access_token: string; refresh_token: string; id: string; email: string }) {
  }
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class Update implements Action {
  readonly type = UPDATE;

  constructor(public userPayload: { username: string, role: string }) {
  }
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;

  constructor(public userPayload: UserInterface) {
  }
}

export class RefreshToken implements Action {
  readonly type = REFRESH_TOKEN;

  constructor(public userPayload: { access_token: string }) {
  }
}

export type AuthActions = Login | Logout | AutoLogin | Update | RefreshToken;
