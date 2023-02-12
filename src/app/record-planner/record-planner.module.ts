import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {SharedModule} from "../shared/shared.module";
import {RouterModule} from "@angular/router";
import {AuthGuard, ProgramSelectedGuard} from "../auth/authguard.service";
import {ProgramResolverService} from "../programs/program-resolver.service";
import {RecordPlannerComponent} from "./record-planner.component";
import {SelectDateComponent} from "./select-date/select-date.component";
import {SelectSchoolComponent} from "./select-school/select-school.component";
import {SelectProductComponent} from "./select-product/select-product.component";
import {ContractResolverService} from "../documents/documents-resolver.service";
import {AngularDualListBoxModule} from 'angular-dual-listbox';
import {FormsModule} from "@angular/forms";
import {RecordResolverService} from "./record-resolver.service";

@NgModule({
  declarations: [
    RecordPlannerComponent,
    SelectDateComponent,
    SelectSchoolComponent,
    SelectProductComponent
  ],
  imports: [
    AngularDualListBoxModule,
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        canActivate: [AuthGuard, ProgramSelectedGuard],
        component: RecordPlannerComponent,
        resolve: [ProgramResolverService, ContractResolverService, RecordResolverService],
        children: [
          {path: ':week_id', component: SelectDateComponent},
          {path: ':week_id/:date/wybierz-szkoly', component: SelectSchoolComponent},
          {path: ':week_id/:date/wybierz-produkty', component: SelectProductComponent}
        ]
      }
    ])
  ]
})
export class RecordPlannerModule {
}
