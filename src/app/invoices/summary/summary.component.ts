import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductStore} from "../../programs/program.model";
import {Record, RecordStates} from "../../record-planner/record.model";
import {InvoiceProduct} from "../invoice.model";
import {Subscription, switchMap} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.reducer";
import {get_str_weight_type, SZT} from "../../shared/common.functions";

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html'
})
export class SummaryComponent implements OnInit, OnDestroy{
  sub: Subscription | null = null;
  fruitVegProducts: ProductStore[] = [];
  dairyProducts: ProductStore[] = [];
  records: Record[] = [];
  invoiceProducts: InvoiceProduct[] = [];


  constructor(private store: Store<AppState>) {
  }

  private get_product_amount(product: ProductStore): [number, number] {
    let amount = 0;
    for (let record of this.records.filter(record => record.product_store_id === product.id && record.state !== RecordStates.PLANNED))
    {
      if (record.delivered_kids_no)
      {
        amount += record.delivered_kids_no;
      }
    }
    return [amount, amount * product.weight];
  }

  get_product_amount_str(product: ProductStore): string
  {
    let [amount, weight] =  this.get_product_amount(product);
    let _weight_type = get_str_weight_type(product.product);
    if (_weight_type === SZT){
      return amount + " " + _weight_type + " [" + weight.toFixed(2) + " " + product.product.weight_type + "]";
    }
    return weight.toFixed(2) + " " + _weight_type +  " [" + amount + " " + SZT + "]";
  }

  get_product_amount_from_invoices(product: ProductStore): number {
    let amount = 0;
    for (let invoice of this.invoiceProducts.filter(invoice => invoice.product_store_id === product.id))
    {
      amount += invoice.amount;
    }
    return amount;
  }

  get_product_from_invoice_str(product: ProductStore): string
  {
    return this.get_product_amount_from_invoices(product)  + " " + get_str_weight_type(product.product);
  }
  get_product_diff_str(product: ProductStore, percent: boolean): string {
    let diff_value = this.get_product_diff(product, percent);
    if (percent){
      return diff_value.toFixed(2) + " %";
    }
    return diff_value.toFixed(2) + " " + get_str_weight_type(product.product);
  }

  get_product_diff(product: ProductStore, percent: boolean): number {
    let [amount, weight] =  this.get_product_amount(product);
    let invoice_amount = this.get_product_amount_from_invoices(product);
    let _weight_type = get_str_weight_type(product.product)
    let diff: number;
    let amount_for_calc: number = _weight_type === SZT ? amount : weight;
    diff = invoice_amount - amount_for_calc;
    return percent ? diff/amount_for_calc * 100 : diff;
  }

  getColorSimple(percent: number, min_val: number = 0){
    if (percent > 10) return 'rgba(248,248,38,0.78)';
    if (percent >= min_val && percent <= 10) return '#2ECC71';
    return '#FF4136'
  }

  getColor(percent: number, product: ProductStore){
    if (product.product.weight_type === "KG")
    {
      return this.getColorSimple(percent, 3);
    }
    return this.getColorSimple(percent);
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.sub = this.store.select("program").pipe(
      switchMap(programState => {
        this.fruitVegProducts = programState.fruitVegProducts;
        this.dairyProducts = programState.dairyProducts;
        return this.store.select("invoice");
      }),
      switchMap(invoiceState => {
        this.invoiceProducts = invoiceState.invoicesProduct;
        return this.store.select("record");
      })).subscribe(recordState => {
        this.records = recordState.records;
      }
    );
  }
}
