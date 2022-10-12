import {RecordListComponent} from "../record-managment/recordlist/recordlist.component";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import {AuthGuard, ProgramSelectedGuard} from "../auth/authguard.service";
import {RecordManagementComponent} from "./record-management.component";
import {ProgramResolverService} from "../programs/program-resolver.service";
import {RecordResolverService} from "../record-planner/record-resolver.service";
import {NgModule} from "@angular/core";
import {RecordEditComponent} from "./record-edit/record-edit.component";

@NgModule({
  declarations: [
    RecordListComponent,
    RecordManagementComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        canActivate: [AuthGuard, ProgramSelectedGuard],
        component: RecordManagementComponent,
        resolve: [ProgramResolverService, RecordResolverService],
        children: [
          {path: ':id', component: RecordEditComponent}
        ]
      }
    ])
  ]
})
export class RecordManagementModule {
}
