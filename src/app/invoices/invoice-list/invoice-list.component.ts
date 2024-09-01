import {Component} from '@angular/core';
import {InvoiceDisposal, InvoiceProduct, InvoiceWithProducts, ProductWithDisposal, Supplier} from "../invoice.model";
import {ADTSettings} from "angular-datatables/src/models/settings";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import {State} from "../store/invoice.reducer";
import {Product, ProductStore} from "../../programs/program.model";
import {get_str_weight_type} from "../../shared/common.functions";
import {Application} from "../../documents/contract.model";
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import * as DocumentsActions from "../../documents/store/documents.action";

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
  docSub: Subscription | null = null;
  error: string = "";
  invoice_disposals: InvoiceDisposal[] = [];
  applications: Application[] = [];
  invoiceSummaryForm: FormGroup;
  isGenerating: boolean = false;

  get applicationsControls() {
    return (this.invoiceSummaryForm.get("applications") as FormArray).controls;
  }

  constructor(private router: Router,
              private activeRoute: ActivatedRoute,
              private store: Store<fromApp.AppState>) {
    this.dtOptions = {
      responsive: false,
      searching: false,
      language: {"url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Polish.json"},
    };
    this.invoiceSummaryForm = new FormGroup<any>({
      'select_all': new FormControl("", []),
      'applications': new FormArray([], atLeastOneCheckboxSelectedValidator()),
    });
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
        for (let disposal of invoiceState.invoiceDisposal) {
          this.setInvoiceDisposal(disposal);
        }
        this.error = invoiceState.error;
        this.suppliers = invoiceState.suppliers;
      }
    )
    this.programSub = this.store.select("program").subscribe((programState) => {
      this.product_storage = this.product_storage.concat(programState.fruitVegProducts).concat(programState.dairyProducts);
    });
    this.docSub = this.store.select("document").subscribe((documentState) => {
      this.applications = documentState.applications;
      this.applications.forEach((app) => {
          (<FormArray>this.invoiceSummaryForm.get("applications")).push(new FormControl(false));
        }
      );
      this.isGenerating = documentState.isGenerating;
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
        invoiceWithProduct.products.push({product: invoice_product, disposals: []});
        return;
      }
    }
  }

  setInvoiceDisposal(disposal: InvoiceDisposal) {
    for (let invoiceWithProduct of this.invoiceWithProducts) {
      for (let product of invoiceWithProduct.products) {
        if (product.product.id === disposal.invoice_product_id) {
          product.disposals.push(disposal);
          return;
        }
      }
    }
  }

  getAppString(app_id: number): string {
    let found_app: Application | undefined = this.applications.find(app => app.id === app_id);
    if (found_app === undefined) {
      return "";
    }
    return "Wniosek nr " + found_app.no.toString();
  }

  getDisposalStr(disposals: InvoiceDisposal[]): string {
    let output = "";
    for (let disposal of disposals) {
      let info = this.getAppString(disposal.application_id) + ": " + disposal.amount.toString() + "\n";
      output += info;
    }
    return output;
  }

  amountDoesNotEqual(productWithDisp: ProductWithDisposal): boolean {
    let sum = 0;
    for (let disposal of productWithDisp.disposals) {
      sum += disposal.amount;
    }
    return sum !== productWithDisp.product.amount;
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

  get_weight(iwp: InvoiceWithProducts) {
    return get_str_weight_type(this.getProduct(iwp.products[0].product.product_store_id));
  }

  checkUncheck() {
    this.applicationsControls.forEach(control => {
      control.setValue(this.invoiceSummaryForm.value.select_all);
    });
  }

  onInvoiceSummary() {
    const selectedAppIds = this.invoiceSummaryForm.value.applications.map((checked: boolean, index: number) => {
      return checked ? this.applications[index].id : null;
    }).filter((res: number | null) => res !== null);
    if (selectedAppIds) {
      this.store.dispatch(new DocumentsActions.GenerateInvoiceSummary({
        applications: selectedAppIds
      }));
      this.invoiceSummaryForm.reset();
    }
  }
}

function atLeastOneCheckboxSelectedValidator(): ValidatorFn {
  return (formArray: AbstractControl): { [key: string]: boolean } | null => {
    const selectedCheckbox = formArray.value.some((isChecked: boolean) => isChecked);
    return selectedCheckbox ? null : {'atLeastOneCheckboxSelected': true};
  };
}
