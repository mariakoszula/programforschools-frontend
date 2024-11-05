import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import {ActivatedRoute, Params} from "@angular/router";
import {InvoiceDisposal, InvoiceProduct} from "../invoice.model";
import {get_current_program, get_str_weight_type} from "../../shared/common.functions";
import {Product, ProductStore} from "../../programs/program.model";
import * as InvoiceAction from "../store/invoice.action";
import {Application} from "../../documents/contract.model";

@Component({
  selector: 'app-invoiceproduct-edit',
  templateUrl: './invoiceproduct-edit.component.html'
})
export class InvoiceproductEditComponent implements OnInit, OnDestroy {
  editSub: Subscription | null = null;
  isEditMode = false;
  paramsSub: Subscription | null = null;
  edit: InvoiceProduct | null | undefined = null;
  productForm: FormGroup;
  appForm: FormGroup;
  id: number = -1;
  invoice_id: number = -1;
  product_storage: ProductStore[] = [];
  programSub: Subscription | null = null;
  product_stored: ProductStore | null | undefined = null;
  docSub: Subscription | null = null;
  applications: Application[] = [];
  application_selected: Application | null | undefined = null;
  invoice_disposals: InvoiceDisposal[] = [];

  constructor(private store: Store<fromApp.AppState>,
              private activeRoute: ActivatedRoute) {
    this.productForm = new FormGroup({});
    this.appForm = new FormGroup({});
  }

  ngOnInit() {
    this.paramsSub = this.activeRoute.params.subscribe(
      (params: Params) => {
        if (params["invoice_id"]) {
          this.invoice_id = +params["invoice_id"];
        }
        if (params["invoice_product_id"])
          this.id = +params["invoice_product_id"];
      });
    this.programSub = this.store.select("program").subscribe((programState) => {
      this.product_storage = this.product_storage.concat(programState.fruitVegProducts).concat(programState.dairyProducts);
      this.docSub = this.store.select("document").subscribe((documentState) => {
        this.applications = documentState.applications;
      })
    });
    this.editSub = this.store.select("invoice").subscribe(state => {
      if (this.id !== -1) {
        this.edit = state.invoicesProduct.find((_item: InvoiceProduct, index) => {
          return _item.id === this.id;
        });
        if (this.edit) {
          const prod_id = this.edit.id;
          this.invoice_disposals = state.invoiceDisposal.filter(id => id.invoice_product_id === prod_id);
          this.isEditMode = true;
        }

      } else {
        this.id = -1;
        this.edit = null;
        this.isEditMode = false;
      }
    });
    this.initForm();
  }

  private initForm() {
    let amount = null;
    let _product_disabled = false;
    if (this.edit) {
      amount = this.edit.amount;
      this.product_stored = this.getProduct(this.edit.product_store_id);
      _product_disabled = true;
    }
    this.productForm.addControl("product_store", new FormControl({
      value: this.product_stored,
      disabled: _product_disabled
    }, [Validators.required]));
    this.productForm.addControl("amount", new FormControl(amount, [Validators.required, Validators.min(0.01)]));
    let invoiceAmount = amount;
    this.appForm.addControl("application_id", new FormControl(null, [Validators.required]));
    this.appForm.addControl("invoiceAmount", new FormControl(invoiceAmount, [Validators.required, Validators.min(0.01)]));

  }


  onSubmit() {
    let formValues = this.productForm.getRawValue();
    formValues["product_store_id"] = formValues["product_store"].id;
    delete formValues["product_store"];
    if (!this.edit) {
      formValues["invoice_id"] = this.invoice_id;
      this.store.dispatch(new InvoiceAction.AddInvoiceProduct(formValues));
    } else {
      delete formValues["product_store_id"]; // Backend not supporting modifying product
      this.store.dispatch(new InvoiceAction.UpdateInvoiceProduct(formValues, this.edit.id));
    }
  }


  onAppSubmit() {
    if (this.edit) {
      let formValues = this.appForm.getRawValue();
      if (+formValues["invoiceAmount"] + this.getSumDisp() > this.edit.amount) {
        confirm("Liczba produktów przekroczona, popraw na właściwą ilość.");
        return;
      }
      formValues["amount"] = formValues["invoiceAmount"];
      delete formValues["invoiceAmount"];
      let found = this.invoice_disposals.find(invoice => invoice.application_id == formValues["application_id"]);
      if (found) {
        delete formValues["application_id"];
        this.store.dispatch(new InvoiceAction.UpdateInvoiceDisposal(formValues, found.id));
      } else {
        formValues["invoice_product_id"] = this.edit.id;
        this.store.dispatch(new InvoiceAction.AddInvoiceDisposal(formValues));
      }
    }
  }

  onClear() {
    this.productForm.reset();
    this.isEditMode = false;
  }

  ngOnDestroy() {
    if (this.editSub) this.editSub.unsubscribe();
    if (this.paramsSub) this.paramsSub.unsubscribe();
    if (this.programSub) this.programSub.unsubscribe();
  }

  getProduct(product_store_id: number): ProductStore | undefined | null {
    return this.product_storage.find(product_store => product_store.id === product_store_id);
  }

  getProductString(product: Product): string {
    return product.name + " [" + get_str_weight_type(product) + "]";
  }

  getAppString(app_id: number): string {
    let found_app: Application | undefined = this.applications.find(app => app.id === app_id);
    if (found_app === undefined) {
      return "";
    }
    return found_app.no.toString() + " " + found_app.type;
  }

  getSumDisp(): number {
    let sum = 0;
    for (let iv of this.invoice_disposals) {
      sum += iv.amount;
    }
    return sum;
  }

  getLeftProducts(): number {
    if (!this.edit)
    {
      return 0;
    }
    return this.edit.amount - this.getSumDisp();
  }
}
