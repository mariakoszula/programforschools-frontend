import {Action, ActionReducer, ActionReducerMap, MetaReducer} from "@ngrx/store";
import * as fromAuth from "../auth/store/auth.reducer";
import * as fromProgram from "../programs/store/program.reducer";
import * as fromCompany from "../companies/store/company.reducer";
import * as fromSchool from "../schools/store/schools.reducer";
import * as fromDocuments from "../documents/store/documents.reducer";
import * as fromRecord from "../record-planner/store/record.reducer";
import {LOGOUT} from "../auth/store/auth.actions";

export interface AppState {
  auth: fromAuth.State;
  program: fromProgram.State;
  company: fromCompany.State;
  school: fromSchool.State;
  document: fromDocuments.State;
  record: fromRecord.State;
}

export function clearStateOnLogout<State extends {}>(reducer: ActionReducer<State>) {
  return function (state: State, action: Action) {
    if (action.type === LOGOUT) {
      state = {} as State;
    }
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<any>[] = [clearStateOnLogout];

export const appReducer: ActionReducerMap<AppState, any> = {
  auth: fromAuth.authReducer,
  program: fromProgram.programReducer,
  company: fromCompany.companyReducer,
  school: fromSchool.schoolReducer,
  document: fromDocuments.documentsReducer,
  record: fromRecord.recordReducer
};

