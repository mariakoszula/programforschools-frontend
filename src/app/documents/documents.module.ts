import {NgModule} from "@angular/core";
import {SharedModule} from "../shared/shared.module";
import {RouterModule} from "@angular/router";
import {AuthGuard, ProgramSelectedGuard} from "../auth/authguard.service";
import {DocumentsComponent} from "./documents.component";
import {ContractlistComponent} from "./contractlist/contractlist.component";
import {ContractsGenComponent} from "./contracts-gen/contracts-gen.component";
import {RegisterGenComponent} from "./register-gen/register-gen.component";
import {ContractDetailsComponent} from "./contract-details/contract-details.component";
import {ProgramResolverService} from "../programs/program-resolver.service";
import {ApplicationResolverService, ContractResolverService} from "./documents-resolver.service";
import {SchoolResolverService} from "../schools/school-resolver.service";
import {DocumentGenerationInfoComponent} from "./document-generation-info/document-generation-info.component";
import {ContractDataEditorComponent} from "./contract-details/contract-data-editor/contract-data-editor.component";
import {AnnexDataEditorComponent} from "./contract-details/annex-data-editor/annex-data-editor.component";
import {RecordGenComponent} from "./record-gen/record-gen.component";
import {RecordResolverService} from "../record-planner/record-resolver.service";
import {ApplicationAddComponent} from "./application-add/application-add.component";
import {ApplicationListComponent} from "./applicationlist/applicationlist.component";
import {SelectAppTypeComponent} from "./select-app-type/select-app-type.component";
import {AngularDualListBoxModule} from "angular-dual-listbox";
import { DataTablesModule } from "angular-datatables";

@NgModule(({
  declarations: [
    DocumentsComponent,
    ContractlistComponent,
    RegisterGenComponent,
    ContractsGenComponent,
    DocumentGenerationInfoComponent,
    ContractDataEditorComponent,
    AnnexDataEditorComponent,
    ContractDetailsComponent,
    RecordGenComponent,
    ApplicationListComponent,
    SelectAppTypeComponent,
    ApplicationAddComponent],
  imports: [
    AngularDualListBoxModule,
    DataTablesModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        canActivate: [AuthGuard, ProgramSelectedGuard],
        component: DocumentsComponent,
        resolve: [ProgramResolverService, SchoolResolverService, ContractResolverService, RecordResolverService],
        children: [
          {path: 'umowy', component: ContractDetailsComponent},
          {path: 'umowy/:school_id', component: ContractDetailsComponent},
          {path: 'umowy/:school_id/:contract_id/edycja', component: ContractDataEditorComponent},
          {path: 'umowy/:school_id/:contract_id/nowy_aneks', component: AnnexDataEditorComponent},
          {path: 'umowy/:school_id/:contract_id/:annex_id/edycja', component: AnnexDataEditorComponent},
          {path: 'rejestry', component: RegisterGenComponent},
          {path: 'generuj_umowy', component: ContractsGenComponent},
          {
            path: 'wydanie-na-zewnatrz',
            component: RecordGenComponent
          },
          {path: 'wnioski', component: ApplicationListComponent, resolve: [ApplicationResolverService]},
          {path: 'wnioski/nowy_wniosek/wybor-typu', component: SelectAppTypeComponent},
          {path: 'wnioski/nowy_wniosek/:type', component: ApplicationAddComponent},
          {path: 'wnioski/:app_id/edycja', component: ApplicationAddComponent}
        ]
      }
    ])
  ]
}))
export class DocumentsModule {

}
