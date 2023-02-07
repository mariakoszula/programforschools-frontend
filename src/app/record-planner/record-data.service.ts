import { Injectable } from '@angular/core';
import {AdditionRecordsResponse, SchoolWithRecordDemand} from "./record.model";
import {Program, Week} from "../programs/program.model";
import {generate_dates} from "../shared/common.functions";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RecordDataService {
  private data: Array<SchoolWithRecordDemand> = [];
  private dates: string[] = [];
  private failedRecords: AdditionRecordsResponse | null = null;
  private program: Program | null = null;
  recordDemandChanged: Subject<Array<SchoolWithRecordDemand>> = new Subject<Array<SchoolWithRecordDemand>>;
  datesChanged: Subject<string[]> = new Subject<string[]>;
  failedRecordChanged: Subject<AdditionRecordsResponse | null> = new Subject<AdditionRecordsResponse | null>;
  constructor() {
  }

  setRecordDemand(data: Array<SchoolWithRecordDemand>) {
    this.recordDemandChanged.next(this.data = data);
  }

  getRecordDemand(): Array<SchoolWithRecordDemand> {
    return this.data;
  }

  setDates(week: Week) {
    this.datesChanged.next(this.dates = generate_dates(week));
  }

  getDates() {
    return this.dates;
  }

  resetDates() {
    this.dates = [];
  }

  setFailedRecords(failedRecords: AdditionRecordsResponse | null) {
    this.failedRecordChanged.next(this.failedRecords = failedRecords);
  }

  getFailedRecords() {
    return this.failedRecords;
  }

  setProgram(program: Program){
    this.program = program;
  }

  getProgram(){
    return this.program;
  }
}
