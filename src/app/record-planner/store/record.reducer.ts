import {AdditionRecordsResponse, Record} from "../record.model";
import {
  ADD_RECORDS,
  DELETE_RECORD_CONFIRM,
  FETCH,
  RecordActions,
  SET_RECORDS,
  UPDATE_RECORD,
  UPDATE_RECORD_CONFIRM
} from "./record.action";

export interface State {
  records: Record[];
  recordsFailedResponse: AdditionRecordsResponse | null;
  isLoading: boolean
}

const initialState = {
  records: [],
  recordsFailedResponse: null,
  isLoading: false
}

export function recordReducer(state: State = initialState, action: RecordActions) {
  switch (action.type) {
    case FETCH:
      return {
        ...state,
        records: [],
        recordsFailedResponse: null,
        isLoading: true
      }
    case ADD_RECORDS:
      return {
        ...state,
        isLoading: true
      }
    case UPDATE_RECORD:
      return {
        ...state,
        isLoading: true
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
        console.log(records_after_update);
      }
      return {
        ...state,
        records: [...records_after_update],
        isLoading: false
      }
    case DELETE_RECORD_CONFIRM:
      let updated_records = [...state.records];
      let record = updated_records.find(record => record.id == action.id);
      if (record) {
        updated_records.splice(updated_records.indexOf(record), 1);
      }
      return {
        ...state,
        records: [...updated_records]
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
        records: [...state.records, ...action.payload.records],
        recordsFailedResponse: updateFailed,
        isLoading: false
      }
    default:
      return state;
  }
}
