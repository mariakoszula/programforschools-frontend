import { Injectable } from '@angular/core';
import {SchoolWithRecordDemand} from "./record.model";
import {Week} from "../programs/program.model";
import {generate_dates} from "../shared/common.functions";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RecordDataService {
  private data: Array<SchoolWithRecordDemand> = [];
  private dates: string[] = [];
  datesChanged: Subject<string[]> = new Subject<string[]>;
  constructor() {
  }

  setData(data: Array<SchoolWithRecordDemand>) {
    this.data = data;
  }

  getData(): Array<SchoolWithRecordDemand> {
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
}
