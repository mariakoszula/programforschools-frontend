import {SchoolsComponent} from "./schools.component";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {AuthGuard} from "../auth/authguard.service";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {SchoolDataEditorComponent} from "./school-data-editor/school-data-editor.component";
import {NgModule} from "@angular/core";
import {SchoolslistComponent} from './schoolslist/schoolslist.component';
import {DataTablesModule} from "angular-datatables";

@NgModule({
  declarations: [
    SchoolsComponent,
    SchoolDataEditorComponent,
    SchoolslistComponent
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    RouterModule.forChild([
      {
        path: '',
        canActivate: [AuthGuard],
        component: SchoolsComponent,
        children: [
          {path: 'nowa', component: SchoolDataEditorComponent},
          {path: ':id/edycja', component: SchoolDataEditorComponent}
        ]
      },
    ]),
    ReactiveFormsModule,
    SharedModule
  ]
})
export class SchoolsModule {
}
