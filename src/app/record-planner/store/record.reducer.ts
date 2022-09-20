import {Record} from "../record.model";
import {FETCH, RecordActions, SET_RECORDS} from "./record.action";

export interface State {
  records: Record[];
  isLoading: boolean
}

const initialState = {
  records: [],
  isLoading: false
}

export function recordReducer(state: State = initialState, action: RecordActions) {
  switch(action.type) {
    case FETCH:
      return {
        ...state,
        records: [],
        isLoading: true
      }
    case SET_RECORDS:
      return {
        ...state,
        records: [...action.payload],
        isLoading: false
      }
    default:
      return state;
  }
}
