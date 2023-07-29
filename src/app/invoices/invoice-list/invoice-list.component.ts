import { Component } from '@angular/core';
import {Invoice, InvoiceProduct, Supplier} from "../invoice.model";
import {ADTSettings} from "angular-datatables/src/models/settings";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import {State} from "../store/invoice.reducer";
import {Product, ProductStore} from "../../programs/program.model";

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html'
})
export class InvoiceListComponent {
  invoices: Invoice[] = [];
  suppliers: Supplier[] = [];
  invoiceProducts: InvoiceProduct[] = [];
  product_storage: ProductStore[] = [];
  dtOptions: ADTSettings = {};
  sub: Subscription | null = null;
  programSub: Subscription | null = null;

    constructor(private router: Router,
              private activeRoute: ActivatedRoute,
              private store: Store<fromApp.AppState>) {
       this.dtOptions = {
        responsive: false,
        searching: false,
        language: {"url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Polish.json"},
      };
  }
  ngOnDestroy(): void {
    if (this.sub){
      this.sub.unsubscribe();
    }
    if (this.programSub) {
      this.programSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.sub = this.store.select("invoice").subscribe(
      (invoiceState: State) => {
        this.invoices = invoiceState.invoices;
        this.invoiceProducts = invoiceState.invoicesProduct;
        this.suppliers = invoiceState.suppliers;
      }
    )
    this.programSub = this.store.select("program").subscribe((programState) => {
      this.product_storage = this.product_storage.concat(programState.fruitVegProducts).concat(programState.dairyProducts);
    });
  }
  addInvoice() {
    this.router.navigate(["faktury/faktury/nowa"]);
  }
  onEditInvoice(invoice_id: number) {
        this.router.navigate(["faktury/faktury/" + invoice_id + '/edycja']);
  }
  getInvoicesProduct(invoice_id: number): InvoiceProduct[] {
      let invoiceProducts = this.invoiceProducts.filter((ip: InvoiceProduct) => {
        return ip.invoice_id === invoice_id;
      });
      if (!invoiceProducts) {
        invoiceProducts = [];
      }
      return invoiceProducts;
  }
  getSupplier(supplier_id: number){
      return this.suppliers.find(supplier => supplier.id === supplier_id)!.nick;
  }
  getProduct(product_store_id: number): Product{
    return this.product_storage.find(product_store => product_store.id === product_store_id)!.product;

  }
}
