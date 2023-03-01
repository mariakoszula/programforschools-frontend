import {Action, ActionReducer, ActionReducerMap, INIT, MetaReducer} from "@ngrx/store";
import * as fromAuth from "../auth/store/auth.reducer";
import * as fromProgram from "../programs/store/program.reducer";
import * as fromCompany from "../companies/store/company.reducer";
import * as fromSchool from "../schools/store/schools.reducer";
import * as fromDocuments from "../documents/store/documents.reducer";
import * as fromRecord from "../record-planner/store/record.reducer";
import {AUTH_ERROR, LOGOUT} from "../auth/store/auth.actions";
import * as programAction from "../programs/store/program.action";

export interface AppState {
  auth: fromAuth.State;
  program: fromProgram.State;
  company: fromCompany.State;
  school: fromSchool.State;
  document: fromDocuments.State;
  record: fromRecord.State;
}

export function resetStoreState(reducer: ActionReducer<AppState>): ActionReducer<any>{
  return function (state: AppState, action: Action) {
    let _state = {...state};
    if (action.type === programAction.FETCH || action.type === LOGOUT || action.type === AUTH_ERROR) {
      localStorage.clear();
      _state.document = fromDocuments.initialState;
      _state.record = fromRecord.initialState;
      _state.program = fromProgram.clearState;
      localStorage.setItem("userData", JSON.stringify(state.auth.user));
    }
    if (action.type === LOGOUT || action.type === AUTH_ERROR) {
      _state.auth = fromAuth.initialStateAuth;
      _state.school = fromSchool.initialState;
    }
    return reducer(_state, action);
  };
}

export const metaReducers: MetaReducer<AppState>[] = [resetStoreState];

export const appReducer: ActionReducerMap<AppState, any> = {
  auth: fromAuth.authReducer,
  program: fromProgram.programReducer,
  company: fromCompany.companyReducer,
  school: fromSchool.schoolReducer,
  document: fromDocuments.documentsReducer,
  record: fromRecord.recordReducer
};

