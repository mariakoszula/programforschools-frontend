import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoadingSpinnerComponent} from "./loading-spinner/loading-spinner.component";
import {SimpleAlertComponent} from "./alert-display/simple-alert.component";
import {ReactiveFormsModule} from "@angular/forms";
import {RecordDisplayComponent} from "./record-display/record-display.component";
import {CutYearFromDate} from "./cut-date.pipe";
import {DayName} from "./get-day-name.pipe";
import {WeeksDisplayComponent} from "./weeks-display/weeks-display.component";
import {RouterModule} from "@angular/router";
import {SortArrayPipe} from "./sort-array.pipe";
import {NotificationsComponent} from "./notifications/notifications.component";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatToolbarModule} from "@angular/material/toolbar";
import {DataTablesModule} from "angular-datatables";

@NgModule({
  declarations: [
    SimpleAlertComponent,
    LoadingSpinnerComponent,
    RecordDisplayComponent,
    CutYearFromDate,
    DayName,
    SortArrayPipe,
    WeeksDisplayComponent,
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    RouterModule,
    MatProgressBarModule,
    MatToolbarModule
  ],
  exports: [
    SimpleAlertComponent,
    LoadingSpinnerComponent,
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    RecordDisplayComponent,
    WeeksDisplayComponent,
    NotificationsComponent,
    SortArrayPipe
  ]
})
export class SharedModule {
}
