import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";
import * as ProductActions from "../store/program.action";
import {Product, ProductStore} from "../program.model";
import {Subscription, switchMap} from "rxjs";
import {ActivatedRoute, Params} from "@angular/router";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-product-editor',
  templateUrl: './product-editor.component.html'
})
export class ProductEditorComponent implements OnInit, OnDestroy {
  error: string = "";
  products_types: string[] = [];
  selectedProductType: string = "";
  products: Product[] = [];
  dairyProducts: ProductStore[] = [];
  fruitVegProduct: ProductStore[] = [];
  productTypeForm: FormGroup;
  editProduct: ProductStore | undefined = undefined;
  sub: Subscription | null = null;
  selected_product_id: number = -1;

  constructor(private store: Store<AppState>, private activeRoute: ActivatedRoute) {
    this.productTypeForm = new FormGroup({});
  }

  initForm() {
    let minAmount = null;
    let weightValue = null;
    let disabled = false;
    let productName = null;
    if (this.editProduct) {
      disabled = true;
      this.selectedProductType = this.editProduct.product.product_type;
      this.products_types = [this.selectedProductType];
      this.products = [];
      productName = this.editProduct.product.name;
      minAmount = this.editProduct.min_amount;
      weightValue = this.editProduct.weight;
    }
    this.productTypeForm.addControl('product_type', new FormControl({
      value: this.selectedProductType,
      disabled: disabled
    }, [Validators.required]));
    this.productTypeForm.addControl('name', new FormControl({
      value: productName,
      disabled: disabled
    }, [Validators.required]));
    this.productTypeForm.addControl('min_amount', new FormControl(minAmount, [Validators.required, Validators.min(1), Validators.max(100)]));
    this.productTypeForm.addControl('weight', new FormControl(weightValue, [Validators.required, Validators.min(0.09), Validators.max(1)]));
    this.productTypeForm.patchValue({'weight': weightValue, 'min_amount': minAmount});
  }

  ngOnInit(): void {
    this.store.dispatch(new ProductActions.FetchProductType());

    this.sub = this.activeRoute.params.pipe(
      map((params: Params) => {
        if (params["product_id"]) {
          return +params["product_id"];
        }
        return -1;
      }),
      switchMap(selected_product_id => {
        this.selected_product_id = selected_product_id;
        return this.store.select("program");

      })).subscribe(state => {
      this.dairyProducts = state.dairyProducts;
      this.fruitVegProduct = state.fruitVegProducts;
      this.products_types = state.product_type;

      if (this.selected_product_id !== -1) {
        let product = this.dairyProducts.find((product: ProductStore) => {
          return product.id === this.selected_product_id
        });
        if (!product) {
          product = this.fruitVegProduct.find((product: ProductStore) => {
            return product.id === this.selected_product_id
          });
        }
        this.editProduct = product;
      }
      this.error = state.error;
      this.initForm();
    });
  }

  onAddOrEditProduct() {
    let formValues = this.productTypeForm.getRawValue();
    if (!this.editProduct) {
      delete formValues["product_type"];
      this.store.dispatch(new ProductActions.AddProduct(this.selectedProductType, formValues));
    } else {
      let product = {...this.editProduct, ...formValues};
      this.store.dispatch(new ProductActions.EditProduct(product));
    }
  }

  onTypeChange(event: any): void {
    if (this.selectedProductType !== event.value) {
      this.selectedProductType = event.value;
      this.store.dispatch(new ProductActions.FetchProduct(this.selectedProductType));
      this.store.select("program").subscribe(state => {
        this.products = state.availableProduct.filter(product => product.product_type === this.selectedProductType);
      });
    }
  }

  setDefaultWeight() {
    let value = 0.15;
    let product = this.productTypeForm.getRawValue()["name"];
    if (product === "mleko") {
      value = 0.25;
    } else if (product === "truskawka") {
      value = 0.1;
    } else if (product === "marchew" || product === "rzodkiewka" || product === "pomidor" || product === "kalarepa" || product === "papryka") {
      value = 0.09;
    } else if (product === "sok owocowy") {
      value = 0.2;
    }
    this.productTypeForm.patchValue({'weight': value});
  }

  get_product_disp(name: string, weight: string) {
    return name + " [" + weight + "]";
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }
}
