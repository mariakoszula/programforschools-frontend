import {Action} from "@ngrx/store";
import {AdditionRecordsResponse, Record, RecordsDemand} from "../record.model";

export const FETCH = "[Record] FETCH";
export const SET_RECORDS = "[Record] SET_RECORDS";
export const ADD_RECORDS = "[Record] ADD_RECORDS";
export const UPDATE_RECORD = "[Record] UPDATE_RECORD";
export const DELETE_RECORD = "[Record] DELETE_RECORD";
export const DELETE_RECORD_CONFIRM = "[Record] DELETE_RECORD_CONFIRM";

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

export class DeleteRecord implements Action {
  readonly type = DELETE_RECORD;
  constructor(public id: number) {
  }
}

export class UpdateRecord implements Action {
  readonly type = UPDATE_RECORD;
  constructor(public payload: Record) {
  }
}

export class DeleteRecordConfirm implements Action {
  readonly type = DELETE_RECORD_CONFIRM;
  constructor(public id: number) {
  }
}

export type RecordActions = Fetch | SetRecords | AddRecords | DeleteRecord | UpdateRecord | DeleteRecordConfirm;

