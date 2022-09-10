import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoadingSpinnerComponent} from "./loading-spinner/loading-spinner.component";
import {SimpleAlertComponent} from "./alert-success/simple-alert.component";
import {DataTablesModule} from "angular-datatables";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    SimpleAlertComponent,
    LoadingSpinnerComponent
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
    ReactiveFormsModule
  ]
})
export class SharedModule { }
