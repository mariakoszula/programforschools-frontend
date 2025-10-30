import {AdditionRecordsResponse, Record, RecordAddResult} from "../record.model";
import {
  ADD_RECORDS, BULK_DELETE_CONFIRM,
  DELETE_RECORD_CONFIRM,
  FETCH,
  RecordActions,
  SET_RECORDS,
  UPDATE_RECORD_CONFIRM
} from "./record.action";

//TODO display record with error
export interface State {
  records: Record[];
  recordsFailedResponse: AdditionRecordsResponse | null;
  isLoading: boolean;
  bulkSkippedInfo: string | null;

}

export const initialState = {
  records: [],
  recordsFailedResponse: null,
  isLoading: false,
  bulkSkippedInfo: null,
}

export function recordReducer(state: State = initialState, action: RecordActions) {
  switch (action.type) {
    case FETCH:
      return {
        ...state,
        records: [],
        recordsFailedResponse: null,
        isLoading: true,
        bulkSkippedInfo: null
      }
    case ADD_RECORDS:
      return {
        ...state,
        isLoading: true,
        bulkSkippedInfo: null
      }
    case UPDATE_RECORD_CONFIRM:
      // TODO can it be simplified?
      let records_after_update = [...state.records];
      const record_to_update = records_after_update.find(record => record.id == action.payload.id);
      if (record_to_update) {
        const updated_record = {
          ...record_to_update,
          ...action.payload
        }
        const indexOfUpdate = state.records.indexOf(record_to_update);
        records_after_update[indexOfUpdate] = updated_record;
      }
      return {
        ...state,
        records: [...records_after_update],
        isLoading: false,
        bulkSkippedInfo: null
      }
    case DELETE_RECORD_CONFIRM:
      let updated_records = [...state.records];
      let record = updated_records.find(record => record.id == action.id);
      if (record) {
        updated_records.splice(updated_records.indexOf(record), 1);
      }
      return {
        ...state,
        records: [...updated_records],
        bulkSkippedInfo: null
      }
    case BULK_DELETE_CONFIRM:
      let recordsToDelete = action.deleted;
      let updated_records_after_delete = state.records.filter((record: Record) => {
        return !recordsToDelete.includes(record.id)
      });

      let skippedRecords = state.records.filter((record: Record) => {
        return action.skipped.includes(record.id)
      });

      return {
        ...state,
        records: [...updated_records_after_delete],
        bulkSkippedInfo: skippedRecords.map((record: Record) => { return record.no;}).join(", ")
      }
    case SET_RECORDS:
      let failed = action.payload.recordsFailedResponse;
      let updateFailed: AdditionRecordsResponse | null = null;
      if (failed) {
        updateFailed = {
          date: failed.date,
          records: [...failed.records]
        }
      }
      return {
        ...state,
        records: [...action.payload.records],
        recordsFailedResponse: updateFailed,
        isLoading: false,
        bulkSkippedInfo: null
      }
    default:
      return state;
  }
}
