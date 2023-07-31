import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import {ActivatedRoute, Params} from "@angular/router";
import {InvoiceProduct} from "../invoice.model";
import {get_current_program} from "../../shared/common.functions";
import {Product, ProductStore} from "../../programs/program.model";

@Component({
  selector: 'app-invoiceproduct-edit',
  templateUrl: './invoiceproduct-edit.component.html'
})
export class InvoiceproductEditComponent implements OnInit, OnDestroy {
  editSub: Subscription | null = null;
  isEditMode = false;
  paramsSub: Subscription | null = null;
  edit: InvoiceProduct | null  | undefined  = null;
  productForm: FormGroup;
  id: number = -1;
  invoice_id: number = -1;
  product_storage: ProductStore[] = [];
  programSub: Subscription | null = null;
  product: Product | null | undefined = null;
  constructor(private store: Store<fromApp.AppState>,
              private activeRoute: ActivatedRoute) {
    this.productForm = new FormGroup({});
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
    });
    this.editSub = this.store.select("invoice").subscribe(state => {
      if (this.id !== -1) {
        this.edit = state.invoicesProduct.find((_item: InvoiceProduct, index) => {
          return _item.id === this.id;
        });
      } else {
        this.id = -1;
        this.edit = null;
      }
    });
    this.initForm();
  }

  private initForm() {
    let amount = null;
    if (this.edit) {
      amount = this.edit.amount;
      this.product = this.getProduct(this.edit.product_store_id);
    }
    this.productForm.addControl("product", new FormControl(this.product, [Validators.required]));
    this.productForm.addControl("amount", new FormControl(amount, [Validators.required, Validators.min(0.01)]));
  }


  onSubmit() {
    let formValues = this.productForm.getRawValue();
    if (!this.edit) {
        formValues["program_id"] = get_current_program().id;
        formValues["invoice_id"] = get_current_program().id;
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

  getProduct(product_store_id: number): Product{
    return this.product_storage.find(product_store => product_store.id === product_store_id)!.product;
  }

  getProductString(product: Product): string {
    return product.name + " [" + product.weight_type + "]";
  }
}
