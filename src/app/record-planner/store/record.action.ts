import {Action} from "@ngrx/store";
import {Record} from "../record.model";

export const FETCH = "[Record] FETCH";
export const SET_RECORDS = "[Record] SET_RECORDS";

export class Fetch implements Action {
  readonly type = FETCH;
}

export class SetRecords implements Action {
  readonly type = SET_RECORDS;

  constructor(public payload: Record[]) {
  }
}

export type RecordActions = Fetch | SetRecords;

