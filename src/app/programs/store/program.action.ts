import {Action} from "@ngrx/store";
import {Program} from "../program.model";

export const ADD = "[Program] ADD";
export const UPDATE = "[Program] UPDATE";
export const FETCH = "[Program] FETCH";
export const SELECT = "[Program] SELECT";
export const SET_MANY = "[Program] SET_MANY";

export class Fetch implements Action {
  readonly type = FETCH;
}

export class Add implements Action {
  readonly type = ADD;

  constructor(public payload: Program) {
  }
}

export class Update implements Action {
  readonly type = UPDATE;

  constructor(public payload: Program) {
  }
}

export class SetMany implements Action {
  readonly type = SET_MANY;

  constructor(public payload: Program[]) {
  }
}

export type ProgramActions = Fetch | Add | Update | SetMany;
