import {Action} from "@ngrx/store";
import {Annex, Contract, Application} from "../contract.model";
import {Record} from "../../record-planner/record.model";
import {Week} from "../../programs/program.model";

export const FETCH_CONTRACTS = "[Documents] FETCH_CONTRACTS";
export const SET_CONTRACTS = "[Documents] SET_CONTRACTS";
export const UPDATE_KIDS_NO = "[Documents] UPDATE_KIDS_NO";
export const GENERATE_CONTRACTS = "[Documents] GENERATE_CONTRACTS";
export const GENERATE_REGISTER = "[Documents] GENERATE_REGISTER";
export const GENERATE_RECORDS_REGISTER = "[Documents] GENERATE_RECORDS_REGISTER";
export const UPDATE_ANNEX = "[Documents] UPDATE_ANNEX";
export const SET_ANNEX = "[Documents] SET_ANNEX";
export const GENERATE_DELIVERY = "[Documents] GENERATE_DELIVERY";
export const QUEUE_GENERATING_TASK_AND_START_POLLING = "[Documents] QUEUE_GENERATING_TASK_AND_START_POLLING";
export const STOP_POLLING = "[Documents] STOP_POLLING";
export const SET_TASK_PROGRESS = "[Documents] SET_TASK_PROGRESS";
export const RESET_NOTIFICATION_COUNTER = "[Documents] RESET_NOTIFICATION_COUNTER";
export const FETCH_APPLICATION = "[Documents] FETCH_APPLICATION";
export const GENERATE_APPLICATION = "[Documents] GENERATE_APPLICATION";
export const SET_APPLICATIONS = "[Documents] SET_APPLICATIONS";
export const CREATE_APPLICATION = "[Documents] CREATE_APPLICATION";
export const UPDATE_APPLICATION = "[Documents] UPDATE_APPLICATION";
export const GENERATE_WEEK_SUMMARY = "[Documents] GENERATE_WEEK_SUMMARY";
export const GENERATE_INVOICE_SUMMARY = "[Documents] GENERATE_INVOICE_SUMMARY";

export class FetchContracts implements Action {
  readonly type = FETCH_CONTRACTS;

  constructor() {

  }
}

export class SetContracts implements Action {
  readonly type = SET_CONTRACTS;

  constructor(public payload: { contracts: Contract[], documents: string[] }, public skip_navigate: boolean = false) {

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

export class GenerateRecordsRegister implements Action {
  readonly type = GENERATE_RECORDS_REGISTER;
}
export class GenerateApplications implements Action {
  readonly type = GENERATE_APPLICATION;

  constructor(public payload: { id: number, no: number, app_date: string, is_last: boolean, start_week: number }) {

  }
}

export class UpdateAnnex implements Action {
  readonly type = UPDATE_ANNEX;

  constructor(public payload: Annex) {
  }
}

export class SetAnnex implements Action {
  readonly type = SET_ANNEX;

  constructor(public payload: { annex: Annex, documents: string[] }, public skip_navigate: boolean = false) {
  }
}

export class UpdateKidsNo implements Action {
  readonly type = UPDATE_KIDS_NO;

  constructor(public payload: Contract, public school_id: number) {
  }
}

export class GenerateDelivery implements Action {
  readonly type = GENERATE_DELIVERY;

  constructor(public records: Record[],
              public delivery_date: string,
              public driver: string,
              public comments: string) {
  }
}

export class GenerateWeekSummary implements Action {
  readonly type = GENERATE_WEEK_SUMMARY;

  constructor(public week: Week) {
  }
}

export class SetTaskProgress implements Action {
  readonly type = SET_TASK_PROGRESS;

  constructor(public payload: { id: string, progress: number, documents: string[], notification: string }) {
  }
}

export class QueueGeneratingTaskAndStartPolling implements Action {
  readonly type = QUEUE_GENERATING_TASK_AND_START_POLLING;

  constructor(public payload: { id: string, name: string}, public route: string | null = null) {
  }
}

export class StopPolling implements Action {
  readonly type = STOP_POLLING;
}

export class ResetNotificationCounter implements Action {
  readonly type = RESET_NOTIFICATION_COUNTER;
}

export class FetchApplication implements Action {
  readonly type = FETCH_APPLICATION;

  constructor() {

  }
}

export class SetApplications implements Action {
  readonly type = SET_APPLICATIONS;

  constructor(public applications: Application[]) {

  }
}

export class CreateApplication implements Action {
  readonly type = CREATE_APPLICATION;

  constructor(public payload: {
    type: string,
    contracts: Contract[],
    weeks: Week[]
  }) {

  }
}

export class UpdateApplication implements Action {
  readonly type = UPDATE_APPLICATION;

  constructor(public payload: {
    id: number,
    contracts: Contract[],
    weeks: Week[]
  }) {
  }
}

export class GenerateInvoiceSummary implements Action {
  readonly type = GENERATE_INVOICE_SUMMARY;

  constructor(public payload: { applications: number[]}) {
  }
}

export type DocumentsActions =
  SetContracts
  | FetchContracts
  | GenerateContracts
  | GenerateRegister
  | GenerateRecordsRegister
  | UpdateAnnex
  | SetAnnex
  | UpdateKidsNo
  | GenerateDelivery
  | QueueGeneratingTaskAndStartPolling
  | SetTaskProgress
  | StopPolling
  | ResetNotificationCounter
  | FetchApplication
  | SetApplications
  | GenerateApplications
  | CreateApplication
  | UpdateApplication
  | GenerateWeekSummary
  | GenerateInvoiceSummary;
