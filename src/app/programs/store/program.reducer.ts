import {ADD, ProgramActions, UPDATE} from "./program.action";
import {Program} from "../program.model";

export interface State {
  programs: Program[];
  indexOfSelectedProgram: number;
  isLoading: boolean;
}

const initialState: State = {
  programs: [],
  indexOfSelectedProgram: -1,
  isLoading: false
};

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
        console.log(indexOfUpdate);
        updated_programs[indexOfUpdate] = updated_program;
      }
      console.log(updated_programs);
      return {
        ...state,
        programs: updated_programs,
        indexOfSelectedProgram: -1,
        isLoading: false
      };
    default:
      return state;
  }
}
