import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {SharedModule} from "../shared/shared.module";
import {RouterModule} from "@angular/router";
import {AuthGuard, ProgramSelectedGuard} from "../auth/authguard.service";
import {DocumentsComponent} from "../documents/documents.component";
import {ProgramResolverService} from "../programs/program-resolver.service";
import {SchoolResolverService} from "../schools/school-resolver.service";
import {ContractsGenComponent} from "../documents/contracts-gen/contracts-gen.component";
import {ContractResolverService} from "../documents/documents-resolver.service";
import {RecordPlannerComponent} from "./record-planner.component";
import {SelectDateComponent} from "./select-date/select-date.component";

@NgModule({
  declarations: [RecordPlannerComponent, SelectDateComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        canActivate: [AuthGuard, ProgramSelectedGuard],
        component: RecordPlannerComponent,
        resolve: [ProgramResolverService, SchoolResolverService],
        children: [
          {path: ':id', component: SelectDateComponent}
        ]
      }
    ])
  ]
})
export class RecordPlannerModule {
}
