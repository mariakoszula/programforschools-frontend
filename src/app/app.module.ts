import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { MainSidebarComponent } from './main-sidebar/main-sidebar.component';
import { ControlSidebarComponent } from './control-sidebar/control-sidebar.component';
import { MainFooterComponent } from './main-footer/main-footer.component';
import {RoutingModule} from "./routing.module";
import {ContentModule} from "./content-wrapper/content.module";
import {ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptorService} from "./auth/auth-interceptor.service";
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from "@ngrx/effects";
import {AuthEffects} from "./auth/store/auth.effects";
import {StoreDevtoolsModule} from '@ngrx/store-devtools'
import {environment} from "../environments/environment";
import {ProgramEffects} from "./programs/store/program.effects";
import {CompanyEffects} from "./companies/store/company.effects";
import {SchoolsEffects} from "./schools/store/schools.effects";
import {DocumentsEffects} from "./documents/store/documents.effects";
import {RecordEffects} from "./record-planner/store/record.effects";
import {SharedModule} from "./shared/shared.module";
import {metaReducers, appReducer} from "./store/app.reducer";
import {InvoiceEffects} from "./invoices/store/invoice.effects";
import { DataTablesModule } from "angular-datatables";
import { CommonModule } from '@angular/common';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    AppComponent,
    MainHeaderComponent,
    MainSidebarComponent,
    ControlSidebarComponent,
    MainFooterComponent
  ],
    imports: [
        BrowserModule,
        DataTablesModule,
        RoutingModule,
        ContentModule,
        ReactiveFormsModule,
        CommonModule,
        HttpClientModule,
        StoreModule.forRoot(appReducer, { metaReducers } ),
        EffectsModule.forRoot([
            AuthEffects,
            ProgramEffects,
            CompanyEffects,
            SchoolsEffects,
            DocumentsEffects,
            RecordEffects,
            InvoiceEffects
        ]),
        StoreDevtoolsModule.instrument({logOnly: environment.production}),
        SharedModule,

    ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    provideAnimationsAsync('noop')
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
