import {CompanyAction, SET} from "./company.action";
import {Company} from "../company.model";

export interface State {
  company: Company | null;
}

const initialState: State = {
  company: null
}

export function companyReducer(state = initialState, action: CompanyAction) {
  switch (action.type) {
    case SET:
      const company = new Company(+action.payload.id, action.payload.name, action.payload.nip,
        action.payload.regon, `ul. ${action.payload.street}, ${action.payload.code} ${action.payload.city}`);
      return {
        company: company
      };
    default:
      return state;
  }
}
