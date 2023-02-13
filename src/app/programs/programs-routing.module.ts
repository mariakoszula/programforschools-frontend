import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ProgramlistComponent} from "./programlist/programlist.component";
import {AuthGuard} from "../auth/authguard.service";
import {ProgramDataEditorComponent} from "./program-add/program-data-editor.component";
import {ProgramsComponent} from "./programs.component";
import {ProgramDataComponent} from "./program-data/program-data.component";
import {ProgramResolverService} from "./program-resolver.service";
import {ProductEditorComponent} from "./product-editor/product-editor.component";
import {WeekEditorComponent} from "./weeks-editor/week-editor.component";

const routes: Routes = [
  {
    path: '',
    component: ProgramsComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', component: ProgramlistComponent, resolve: [ProgramResolverService]},
      {path: 'nowy', component: ProgramDataEditorComponent},
      {path: ':id', component: ProgramDataComponent, resolve: [ProgramResolverService]},
      {path: ':id/edycja', component: ProgramDataEditorComponent, resolve: [ProgramResolverService]},
      {path: ':id/tygodnie', component: WeekEditorComponent, resolve: [ProgramResolverService]},
      {path: ':id/produkty', component: ProductEditorComponent, resolve: [ProgramResolverService]},
      {path: ':id/produkty/:product_id/edycja', component: ProductEditorComponent, resolve: [ProgramResolverService]},
      {path: ':id/tygodnie/:week_id/edycja', component: WeekEditorComponent, resolve: [ProgramResolverService]},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProgramRoutingModule {}
