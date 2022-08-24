import { NgModule } from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "./content-wrapper/dashboard/dashboard.component";

const appRoutes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'logowanie', loadChildren: () => import('./auth/auth.module').then(module => module.AuthModule)},
  {path: 'uzytkownicy', loadChildren: () => import('./user-management/user-management.module').then(module => module.UserManagementModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class RoutingModule { }
