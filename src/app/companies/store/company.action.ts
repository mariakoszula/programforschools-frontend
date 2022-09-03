import {Action} from "@ngrx/store";

export const FETCH = "[Company] FETCH";
export const SET = "[Company] SET";

export interface CompanyResponse {
    id: string,
    name: string,
    nip: string,
    regon: string,
    street: string,
    city: string,
    code: string
}

export class Fetch implements Action {
  readonly type = FETCH;
}

export class Set implements Action {
  readonly type = SET;

  constructor(public payload: CompanyResponse) {
  }
}

export type CompanyAction = Fetch | Set;
