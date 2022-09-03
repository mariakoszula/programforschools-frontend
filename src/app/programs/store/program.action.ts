import {Action} from "@ngrx/store";
import {Program} from "../program.model";

export const ADD = "[Program] ADD";
export const UPDATE = "[Program] UPDATE";
export const FETCH = "[Program] FETCH";
export const SELECT = "[Program] SELECT";
export const SET_ALL = "[Program] SET_ALL";
export const SAVE = "[Program] SAVE";

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

export class Save implements Action {
  readonly type = SAVE;

  constructor(public payload: Program) {
  }
}

export class SetAll implements Action {
  readonly type = SET_ALL;

  constructor(public payload: Program[]) {
  }
}


export class Select implements Action {
  readonly type = SELECT;

  constructor(public payload: number) {
  }
}

export type ProgramActions = Fetch | Add | Update | SetAll | Select | Save;
