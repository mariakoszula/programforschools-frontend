import { Injectable } from '@angular/core';
import {RecordRequiredForSchool} from "./record.model";

@Injectable({
  providedIn: 'root'
})
export class ShareRecordDataService {
  private data: Array<RecordRequiredForSchool> = [];
  constructor() { }

  setData(data: Array<RecordRequiredForSchool>) {
    this.data = data;
  }

  getData(): Array<RecordRequiredForSchool> {
    return this.data;
  }
}
