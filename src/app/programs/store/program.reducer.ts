import {ADD, FETCH, ProgramActions, SAVE, SELECT, SET_ALL, UPDATE} from "./program.action";
import {Program} from "../program.model";

export interface State {
  programs: Program[];
  indexOfSelectedProgram: number;
  isLoading: boolean;
}

const initialState: State = prepareInitialState();

function prepareInitialState() {
  const programDataJson = localStorage.getItem("currentProgram");
  if (!programDataJson) {
    return {
      programs: [],
      indexOfSelectedProgram: -1,
      isLoading: false
    };
  } else {
    return {
      programs: [JSON.parse(programDataJson)],
      indexOfSelectedProgram: 0,
      isLoading: false
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
