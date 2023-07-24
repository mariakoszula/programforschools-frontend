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
        children: [
          {path: 'dostawcy', component: SupplierListComponent},
          {path: 'faktury', component: InvoiceListComponent},
          {path: 'zestawienia', component: SummaryComponent}
        ]
      },
    ]),
  ]
})
export class InvoicesModule { }
