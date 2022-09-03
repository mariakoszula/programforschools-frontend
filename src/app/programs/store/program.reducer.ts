import {
  ADD,
  ADD_WEEK,
  FETCH,
  ProgramActions,
  SAVE,
  SAVE_WEEK,
  SELECT,
  SET_ALL,
  SET_WEEK_ALL,
  UPDATE
} from "./program.action";
import {Program, Week} from "../program.model";

export interface State {
  programs: Program[];
  indexOfSelectedProgram: number;
  isLoading: boolean;
  weeks: Week[];
}

const initialState: State = prepareInitialState();

function prepareInitialState() {
  const programDataJson = localStorage.getItem("currentProgram");
  if (!programDataJson) {
    return {
      programs: [],
      indexOfSelectedProgram: -1,
      isLoading: false,
      weeks: []
    };
  } else {
    return {
      programs: [JSON.parse(programDataJson)],
      indexOfSelectedProgram: 0,
      isLoading: false,
      weeks: []
    };
  }

}

export function programReducer(state = initialState, action: ProgramActions) {
  switch (action.type) {
    case ADD:
      return {
        ...state,
        programs: [...state.programs, action.payload],
        indexOfSelectedProgram: -1,
        isLoading: true
      };
    case ADD_WEEK:
      return {
        ...state,
        weeks: [...state.weeks, action.payload]
      };
    case SAVE_WEEK:
      const weeks_updated = [...state.weeks];
      const week = state.weeks.find((_week, index) => {
        return _week.week_no === action.payload.week_no && _week.program_id === action.payload.program_id;
      });
      if (week) {
        const week_updated = {
          ...week,
          ...action.payload
        }
        const indexOfUpdate = state.weeks.indexOf(week);
        weeks_updated[indexOfUpdate] = week_updated;
      }
      return {
        ...state,
        weeks: weeks_updated,
      };
    case UPDATE:
    case SAVE:
      const program = state.programs.find((program, index) => {
        return program.semester_no === action.payload.semester_no && program.school_year === action.payload.school_year;
      });
      const updated_programs = [...state.programs];
      if (program) {
        const updated_program = {
          ...program,
          ...action.payload
        }
        const indexOfUpdate = state.programs.indexOf(program);
        updated_programs[indexOfUpdate] = updated_program;
      }
      return {
        ...state,
        programs: updated_programs,
        isLoading: false
      };
    case FETCH:
      return {
        ...state,
        programs: [...state.programs],
        indexOfSelectedProgram: -1,
        isLoading: true
      };
    case SET_ALL:
      return {
        ...state,
        programs: [...action.payload],
        isLoading: false
      };
    case SET_WEEK_ALL:
      return {
        ...state,
        weeks: [...action.payload],
      };
    case SELECT:
      return {
        ...state,
        programs: [...state.programs],
        indexOfSelectedProgram: action.payload,
        isLoading: false
      };
    default:
      return state;
  }
}
