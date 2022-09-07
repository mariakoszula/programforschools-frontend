import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../shared/shared.module";
import {RouterModule} from "@angular/router";
import {AuthGuard, ProgramSelectedGuard} from "../auth/authguard.service";
import {DocumentsComponent} from "./documents.component";
import {ContractlistComponent} from "./contractlist/contractlist.component";
import {ContractsGenComponent} from "./contracts-gen/contracts-gen.component";
import {RegisterGenComponent} from "./register-gen/register-gen.component";
import {ContractDetailsComponent} from "./contract-details/contract-details.component";

@NgModule(({
  declarations: [DocumentsComponent, ContractlistComponent, RegisterGenComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        canActivate: [AuthGuard, ProgramSelectedGuard],
        component: DocumentsComponent,
        children: [
          {path: 'umowy', component: ContractsGenComponent},
          {path: 'umowy/:id', component: ContractDetailsComponent},
          {path: 'rejestr', component: RegisterGenComponent},
        ]
      }
    ])
  ]
}))
export class DocumentsModule {

}
