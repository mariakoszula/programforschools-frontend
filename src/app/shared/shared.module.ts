import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoadingSpinnerComponent} from "./loading-spinner/loading-spinner.component";
import {SimpleAlertComponent} from "./alert-display/simple-alert.component";
import {DataTablesModule} from "angular-datatables";
import {ReactiveFormsModule} from "@angular/forms";
import {RecordDisplayComponent} from "./record-display/record-display.component";
import {CutYearFromDate} from "./cut-date.pipe";

@NgModule({
  declarations: [
    SimpleAlertComponent,
    LoadingSpinnerComponent,
    RecordDisplayComponent,
    CutYearFromDate
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule
  ],
  exports: [
    SimpleAlertComponent,
    LoadingSpinnerComponent,
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    RecordDisplayComponent
  ]
})
export class SharedModule {
}
