import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ProgramlistComponent} from "./programlist/programlist.component";
import {AdminGuard, AuthGuard} from "../auth/authguard.service";
import {ProgramDataEditorComponent} from "./program-add/program-data-editor.component";
import {ProgramsComponent} from "./programs.component";
import {ProgramDataComponent} from "./program-data/program-data.component";
import {ProgramResolverService} from "./program-resolver.service";

const routes: Routes = [
  {
    path: '',
    component: ProgramsComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', component: ProgramlistComponent, resolve: [ProgramResolverService]},
      {path: 'nowy', component: ProgramDataEditorComponent},
      {path: ':id', component: ProgramDataComponent, resolve: [ProgramResolverService]},
      {path: ':id/edycja', component: ProgramDataEditorComponent, resolve: [ProgramResolverService]}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProgramRoutingModule {}