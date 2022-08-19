import { NgModule } from '@angular/core';
import {NavigateComponent} from "./navigate/navigate.component";
import {ContentWrapperComponent} from "./content-wrapper.component";
import {RouterModule} from "@angular/router";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {CommonModule} from "@angular/common";


@NgModule({
  declarations: [
    NavigateComponent,
    DashboardComponent,
    ContentWrapperComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    ContentWrapperComponent,
  ]
})
export class ContentModule { }
