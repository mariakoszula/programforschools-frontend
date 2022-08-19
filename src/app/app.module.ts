import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { MainSidebarComponent } from './main-sidebar/main-sidebar.component';
import { ControlSidebarComponent } from './control-sidebar/control-sidebar.component';
import { MainFooterComponent } from './main-footer/main-footer.component';
import {AuthComponent} from "./auth/auth.component";
import {RoutingModule} from "./routing.module";
import {ContentModule} from "./content-wrapper/content.module";
import {ReactiveFormsModule} from "@angular/forms";
import {LoadingSpinnerComponent} from "./shared/loading-spinner/loading-spinner.component";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    MainHeaderComponent,
    MainSidebarComponent,
    ControlSidebarComponent,
    MainFooterComponent,
    AuthComponent,
    LoadingSpinnerComponent

  ],
  imports: [
    BrowserModule,
    RoutingModule,
    ContentModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
