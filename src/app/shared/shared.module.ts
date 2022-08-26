import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoadingSpinnerComponent} from "./loading-spinner/loading-spinner.component";
import {SimpleAlertComponent} from "./alert-success/simple-alert.component";



@NgModule({
  declarations: [
    SimpleAlertComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SimpleAlertComponent,
    LoadingSpinnerComponent
  ]
})
export class SharedModule { }
