import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import { AuthComponent } from "./auth/auth.component";
import {DashboardComponent} from "./content-wrapper/dashboard/dashboard.component";

const appRoutes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'logowanie', component: AuthComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class RoutingModule { }
