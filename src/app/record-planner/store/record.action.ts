import {Action} from "@ngrx/store";
import {AdditionRecordsResponse, Record, RecordsDemand} from "../record.model";

export const FETCH = "[Record] FETCH";
export const SET_RECORDS = "[Record] SET_RECORDS";
export const ADD_RECORDS = "[Record] ADD_RECORDS";
export const UPDATE_RECORD = "[Record] UPDATE_RECORD"; //TODO when displaying record table
export const DELETE_RECORD = "[Record] DELETE_RECORD";  //TODO when displaying record table

export class Fetch implements Action {
  readonly type = FETCH;
}

export class SetRecords implements Action {
  readonly type = SET_RECORDS;

  constructor(public payload: {records: Record[], recordsFailedResponse: AdditionRecordsResponse | null}) {
  }
}

export class AddRecords implements Action {
  readonly type = ADD_RECORDS;

  constructor(public payload: RecordsDemand) {
  }
}

export type RecordActions = Fetch | SetRecords | AddRecords;

