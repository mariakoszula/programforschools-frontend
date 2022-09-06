import {Action} from "@ngrx/store";
import {School} from "../school.model";

export const ADD = "[Program] ADD";
export const UPDATE = "[Program] UPDATE";
export const FETCH = "[Program] FETCH";
export const SET_ALL = "[Program] SET_ALL";
export const SAVE = "[Program] SAVE";


export class Fetch implements Action {
  readonly type = FETCH;
}

export class Add implements Action {
  readonly type = ADD;

  constructor(public payload: School) {
  }
}

export class Update implements Action {
  readonly type = UPDATE;

  constructor(public payload: School) {
  }
}

export class Save implements Action {
  readonly type = SAVE;

  constructor(public payload: School) {
  }
}

export class SetAll implements Action {
  readonly type = SET_ALL;

  constructor(public payload: School[]) {
  }
}

export type SchoolActions = Fetch | Add | Update | SetAll | Save;
