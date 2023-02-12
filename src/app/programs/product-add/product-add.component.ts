import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";
import * as ProductActions from "../store/program.action";
import {Product, ProductStore} from "../program.model";

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html'
})
export class ProductAddComponent implements OnInit {
  error: string = "";
  products_types: string[] = [];
  selectedProductType: string = "";
  products: Product[] = [];
  dairyProducts: ProductStore[] = [];
  fruitVegProduct: ProductStore[] = [];
  productTypeForm: FormGroup;

  constructor(private store: Store<AppState>) {
    this.productTypeForm = new FormGroup({
      "product_type": new FormControl("", []),
      "name": new FormControl("", [Validators.required]),
      "min_amount": new FormControl("", [Validators.required, Validators.min(1), Validators.max(100)]),
      "weight": new FormControl("0.15", [Validators.required, Validators.min(0.09), Validators.max(1)])
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new ProductActions.FetchProductType());
    this.store.select("program").subscribe(state => {
      this.products_types = state.product_type;
      this.dairyProducts = state.dairyProducts;
      this.fruitVegProduct = state.fruitVegProducts;
      this.error = state.error;
    });
  }

  onAddProduct() {
    let formValues = this.productTypeForm.getRawValue();
    delete formValues["product_type"];
    this.store.dispatch(new ProductActions.AddProduct(this.selectedProductType, formValues));
  }

  onTypeChange(event: any): void {
    if (this.selectedProductType !== event.value) {
      this.selectedProductType = event.value;
      if (this.products.length === 0) {
        this.store.dispatch(new ProductActions.FetchProduct(this.selectedProductType));
        this.store.select("program").subscribe(state => {
          this.products = state.availableProduct;
        });
      }
    }
  }

  get_products_by_type(): Product[] {
    if (this.products) {
      return this.products.filter(product => product.product_type === this.selectedProductType);
    }
    return [];
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
}
