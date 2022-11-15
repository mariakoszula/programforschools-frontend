import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoadingSpinnerComponent} from "./loading-spinner/loading-spinner.component";
import {SimpleAlertComponent} from "./alert-display/simple-alert.component";
import {DataTablesModule} from "angular-datatables";
import {ReactiveFormsModule} from "@angular/forms";
import {RecordDisplayComponent} from "./record-display/record-display.component";
import {CutYearFromDate} from "./cut-date.pipe";
import {WeeksDisplayComponent} from "./weeks-display/weeks-display.component";
import {NotificationsComponent} from "../documents/notifications/notifications.component";
import {RouterModule} from "@angular/router";

@NgModule({
    declarations: [
        SimpleAlertComponent,
        LoadingSpinnerComponent,
        RecordDisplayComponent,
        CutYearFromDate,
        WeeksDisplayComponent,
        NotificationsComponent
    ],
  imports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    SimpleAlertComponent,
    LoadingSpinnerComponent,
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    RecordDisplayComponent,
    WeeksDisplayComponent,
    NotificationsComponent
  ]
})
export class SharedModule {
}
