import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthComponent} from "./auth.component";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import {AuthGuardForLogin} from "./authguard.service";



@NgModule({
  declarations: [AuthComponent
    ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
       {path: '', component: AuthComponent, canActivate: [AuthGuardForLogin]},
    ])
  ]
})
export class AuthModule { }
