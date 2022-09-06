import {School} from "../school.model";
import {ADD, FETCH, SAVE, SchoolActions, SET_ALL, UPDATE} from "./schools.action";

export interface State {
  schools: School[];
  isLoading: boolean;
}

const initialState = {
  schools: [],
  isLoading:  false
}

export function schoolReducer(state: State = initialState, action: SchoolActions) {
  switch (action.type) {
    case ADD:
      return {
        ...state,
        schools: [...state.schools, action.payload],
        isLoading: true
      }
    case FETCH:
      return {
        ...state,
        schools: [...state.schools],
        isLoading: true
      }
    case SET_ALL:
      return {
        ...state,
        schools: [...action.payload],
        isLoading: false
      }
    case UPDATE:
    case SAVE:
      const school: School | any = state.schools.find((_school: School, index) => {
        return _school.nick === action.payload.nick;
      });
      const updated_schools = [...state.schools];
      if (school) {
        const updated_school = {
          ...school,
          ...action.payload
        }
        const indexOfUpdate = state.schools.indexOf(school);
        updated_schools[indexOfUpdate] = updated_school;
      }
      return {
        ...state,
        schools: updated_schools,
        isLoading: false
      }
    default:
      return state;

  }
}
