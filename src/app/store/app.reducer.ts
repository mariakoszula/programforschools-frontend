import {ActionReducerMap} from "@ngrx/store";
import * as fromAuth from "../auth/store/auth.reducer";
import * as fromProgram from "../programs/store/program.reducer";
import * as fromCompany from "../companies/store/company.reducer";
import * as fromSchool from "../schools/store/schools.reducer";
import * as fromDocuments from "../documents/store/documents.reducer";

export interface AppState {
  auth: fromAuth.State;
  program: fromProgram.State;
  company: fromCompany.State;
  school: fromSchool.State;
  document: fromDocuments.State;
}

export const appReducer: ActionReducerMap<AppState, any> = {
  auth: fromAuth.authReducer,
  program: fromProgram.programReducer,
  company: fromCompany.companyReducer,
  school: fromSchool.schoolReducer,
  document: fromDocuments.documentsReducer,
};
