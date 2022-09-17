import { NgModule } from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "./content-wrapper/dashboard/dashboard.component";

const appRoutes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'logowanie', loadChildren: () => import('./auth/auth.module').then(module => module.AuthModule)},
  {path: 'uzytkownicy', loadChildren: () => import('./user-management/user-management.module').then(module => module.UserManagementModule)},
  {path: 'programy', loadChildren: () => import('./programs/programs.module').then(module => module.ProgramsModule)},
  {path: 'szkoly', loadChildren: () => import('./schools/schools.module').then(module => module.SchoolsModule)},
  {path: 'dokumenty', loadChildren: () => import('./documents/documents.module').then(module => module.DocumentsModule)},
  {path: 'planowanie', loadChildren: () => import('./record-planner/record-planner.module').then(module => module.RecordPlannerModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class RoutingModule { }
