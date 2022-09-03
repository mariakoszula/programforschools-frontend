import {ActionReducerMap} from "@ngrx/store";
import * as fromAuth from "../auth/store/auth.reducer";
import * as fromProgram from "../programs/store/program.reducer";
import * as fromCompany from "../companies/store/company.reducer";

export interface AppState {
  auth: fromAuth.State;
  programs: fromProgram.State;
  company: fromCompany.State;
}

export const appReducer: ActionReducerMap<AppState, any> = {
  auth: fromAuth.authReducer,
  programs: fromProgram.programReducer,
  company: fromCompany.companyReducer
};
