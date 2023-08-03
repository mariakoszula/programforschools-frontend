import {Component} from '@angular/core';
import {Invoice, InvoiceProduct, Supplier} from "../invoice.model";
import {ADTSettings} from "angular-datatables/src/models/settings";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import {State} from "../store/invoice.reducer";
import {Product, ProductStore} from "../../programs/program.model";

interface InvoiceWithProducts {
  invoice: Invoice,
  products: InvoiceProduct[];
}

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html'
})
export class InvoiceListComponent {
  suppliers: Supplier[] = [];
  invoiceWithProducts: InvoiceWithProducts[] = [];
  product_storage: ProductStore[] = [];
  dtOptions: ADTSettings = {};
  sub: Subscription | null = null;
  programSub: Subscription | null = null;
  error: string = "";
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
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.programSub) {
      this.programSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.sub = this.store.select("invoice").subscribe(
      (invoiceState: State) => {
        for (let invoice of invoiceState.invoices) {
          this.invoiceWithProducts.push({invoice: invoice, products: []});
        }
        for (let product of invoiceState.invoicesProduct) {
          this.setInvoiceProduct(product);
        }
        this.error = invoiceState.error;
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

  setInvoiceProduct(invoice_product: InvoiceProduct) {
    for (let invoiceWithProduct of this.invoiceWithProducts) {
      if (invoiceWithProduct.invoice.id === invoice_product.invoice_id) {
        invoiceWithProduct.products.push(invoice_product);
        return;
      }
    }
  }

  getSupplier(supplier_id: number) {
    return this.suppliers.find(supplier => supplier.id === supplier_id)!.nick;
  }

  getProduct(product_store_id: number): Product {
    return this.product_storage.find(product_store => product_store.id === product_store_id)!.product;
  }

  onAddProduct(invoice_id: number) {
    this.router.navigate(["faktury/faktury/" + invoice_id + '/nowy_produkt']);
  }

  onEditInvoiceProduct(invoice_product_id: number) {
    this.router.navigate(["faktury/faktury/" + invoice_product_id + '/edycja-produktu']);
  }
}
