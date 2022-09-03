import {Action} from "@ngrx/store";
import {Program, Week} from "../program.model";

export const ADD = "[Program] ADD";
export const UPDATE = "[Program] UPDATE";
export const FETCH = "[Program] FETCH";
export const SELECT = "[Program] SELECT";
export const SET_ALL = "[Program] SET_ALL";
export const SET_WEEK_ALL = "[Program] SET_WEEK_ALL";
export const SAVE = "[Program] SAVE";
export const ADD_WEEK = "[Program] ADD_WEEK";
export const SAVE_WEEK = "[Program] SAVE_WEEK";

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

export class AddWeek implements Action {
  readonly type = ADD_WEEK;

  constructor(public payload: Week) {
  }
}

export class SaveWeek implements Action {
  readonly type = SAVE_WEEK;

  constructor(public payload: Week) {
  }
}

export class SetAllWeek implements Action {
  readonly type = SET_WEEK_ALL;

  constructor(public payload: Week[]) {
  }
}
export type ProgramActions = Fetch | Add | Update | SetAll | Select | Save | AddWeek | SaveWeek | SetAllWeek;
