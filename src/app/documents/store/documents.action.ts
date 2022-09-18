import {Action} from "@ngrx/store";
import {Annex, Contract} from "../contract.model";

export const FETCH_CONTRACTS = "[Documents] FETCH_CONTRACTS";
export const SET_CONTRACTS = "[Documents] SET_CONTRACTS";
export const UPDATE_KIDS_NO = "[Documents] UPDATE_KIDS_NO";
export const GENERATE_CONTRACTS = "[Documents] GENERATE_CONTRACTS";
export const GENERATE_REGISTER = "[Documents] GENERATE_REGISTER";
export const UPDATE_ANNEX = "[Documents] UPDATE_ANNEX";
export const SET_ANNEX = "[Documents] SET_ANNEX";


export class FetchContracts implements Action {
  readonly type = FETCH_CONTRACTS;

  constructor(public payload: number) {

  }
}

export class SetContracts implements Action {
  readonly type = SET_CONTRACTS;

  constructor(public payload: {contracts: Contract[], documents: string[]}) {

  }
}

export class GenerateContracts implements Action {
  readonly type = GENERATE_CONTRACTS;

  constructor(public payload: { school_ids: number[]; contract_date: string }) {
  }
}

export class GenerateRegister implements Action {
  readonly type = GENERATE_REGISTER;
}


export class UpdateAnnex implements Action {
  readonly type = UPDATE_ANNEX;

  constructor(public payload: Annex) {
  }
}

export class SetAnnex implements Action {
  readonly type = SET_ANNEX;

  constructor(public payload: {annex: Annex, documents: string[]}) {
  }
}

export class UpdateKidsNo implements Action {
  readonly type = UPDATE_KIDS_NO;

  constructor(public payload: Contract, public school_id: number) {
  }
}

export type DocumentsActions = SetContracts | FetchContracts | GenerateContracts |
  GenerateRegister | UpdateAnnex | SetAnnex | UpdateKidsNo;
