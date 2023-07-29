import { NgModule } from '@angular/core';
import {InvoiceEditComponent} from "./invoice-edit/invoice-edit.component";
import {InvoiceListComponent} from "./invoice-list/invoice-list.component";
import {SupplierEditComponent} from "./supplier-edit/supplier-edit.component";
import {SupplierListComponent} from "./supplier-list/supplier-list.component";
import {RouterModule} from "@angular/router";
import {AuthGuard} from "../auth/authguard.service";
import { SummaryComponent } from './summary/summary.component';
import {InvoicesComponent} from "./invoices.component";
import {SharedModule} from "../shared/shared.module";
import {SuppliersResolverService} from "./supplier-resolver.service";
import {ProgramResolverService} from "../programs/program-resolver.service";
import {InvoiceResolverService} from "./invoice-resolver.service";
import {InvoiceProductResolverService} from "./invoiceproduct-resolver.service";



@NgModule({
  declarations: [
    InvoiceEditComponent,
    InvoiceListComponent,
    SupplierEditComponent,
    SupplierListComponent,
    InvoicesComponent,
    SummaryComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        canActivate: [AuthGuard],
        component: InvoicesComponent,
        resolve: [ProgramResolverService, SuppliersResolverService, InvoiceProductResolverService, InvoiceResolverService],
        children: [
          {path: 'dostawcy', component: SupplierListComponent},
          {path: 'dostawcy/nowy', component: SupplierEditComponent},
          {path: 'dostawcy/:supplier_id/edycja', component: SupplierEditComponent},
          {path: 'faktury', component: InvoiceListComponent },
          {path: 'faktury/nowa', component: InvoiceEditComponent},
          {path: 'faktury/:invoice_id/edycja', component: InvoiceEditComponent},
          {path: 'zestawienia', component: SummaryComponent}
        ]
      },
    ]),
  ]
})
export class InvoicesModule { }
