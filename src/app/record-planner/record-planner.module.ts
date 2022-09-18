import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {SharedModule} from "../shared/shared.module";
import {RouterModule} from "@angular/router";
import {AuthGuard, ProgramSelectedGuard} from "../auth/authguard.service";
import {ProgramResolverService} from "../programs/program-resolver.service";
import {SchoolResolverService} from "../schools/school-resolver.service";
import {RecordPlannerComponent} from "./record-planner.component";
import {SelectDateComponent} from "./select-date/select-date.component";
import {SelectSchoolComponent} from "./select-school/select-school.component";
import {SelectProductComponent} from "./select-product/select-product.component";

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
          {path: ':id', component: SelectDateComponent},
          {path: ':id/:date/wybierz-szkoly', component: SelectSchoolComponent},
          {path: ':id/:date/wybierz-produkty', component: SelectProductComponent}
        ]
      }
    ])
  ]
})
export class RecordPlannerModule {
}
