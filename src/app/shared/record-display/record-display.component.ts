import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {DAIRY_PRODUCT, FRUIT_VEG_PRODUCT} from "../namemapping.utils";
import {Subscription, concatMap, switchMap, Observable} from "rxjs";
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";
import {ActivatedRoute} from "@angular/router";
import {RecordDataService} from "../../record-planner/record-data.service";
import {Record} from "../../record-planner/record.model";
import {Contract} from "../../documents/contract.model";
import {ProductStore} from "../../programs/program.model";
import {take} from "rxjs/operators";

const MAXIMUM_CONTRACT_NO = 40;
const MAXIMUM_DATE_PER_WEEK_NO = 5;

@Component({
  selector: 'app-record-display',
  templateUrl: './record-display.component.html'
})
export class RecordDisplayComponent implements OnInit, OnDestroy, OnChanges {
  @Input() clickableView = false;
  @Input() records: Record[] = [];
  @Input() contracts: Contract[] = [];
  @Input() fruitVegProducts: ProductStore[] = [];
  @Input() dairyProducts: ProductStore[] = [];

  sub: Subscription | null = null;
  dates: string[];
  fruitVeg = FRUIT_VEG_PRODUCT;
  dairy = DAIRY_PRODUCT;
  productsMapping: { [key: string]: ProductStore[] } = {};

  productFruitVegStorage: string[][];
  productDairyStorage: string[][];

  constructor(private recordDataService: RecordDataService) {

    this.productFruitVegStorage = [];
    this.productDairyStorage = [];
    RecordDisplayComponent.initEmptyProducts(this.productFruitVegStorage);
    RecordDisplayComponent.initEmptyProducts(this.productDairyStorage);
    this.dates = this.recordDataService.getDates();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.contracts = changes["contracts"] ? changes["contracts"].currentValue : this.contracts;
    this.fruitVegProducts = changes["fruitVegProducts"] ? changes["fruitVegProducts"].currentValue : this.fruitVegProducts;
    this.dairyProducts = changes["dairyProducts"] ? changes["dairyProducts"].currentValue : this.dairyProducts;
    this.records = changes["records"] ? changes["records"].currentValue : this.records;
    this.setRecordsInProductStorages();
  }

  static initEmptyProducts(storage_list: string[][]) {
    for (let i = 0; i < MAXIMUM_CONTRACT_NO; i++) {
      storage_list.push([]);
      for (let _ = 0; _ < MAXIMUM_DATE_PER_WEEK_NO; _++) {
        storage_list[i].push("");
      }
    }
  }

  ngOnInit(): void {
    this.sub = this.recordDataService.datesChanged.subscribe(dates => {
      this.dates = dates;
      this.setRecordsInProductStorages();
    });
    this.setRecordsInProductStorages();
  }


  private setRecordsInProductStorages() {
    this.productsMapping[this.fruitVeg] = this.fruitVegProducts;
    this.productsMapping[this.dairy] = this.dairyProducts;
    this.setProducts(this.productFruitVegStorage, this.fruitVeg);
    this.setProducts(this.productDairyStorage, this.dairy);
  }

  private setProducts(storage_list: string[][], product_type: string) {
    for (let contract_i = 0; contract_i < this.contracts.length; contract_i++) {
      if (contract_i > MAXIMUM_CONTRACT_NO) {
        throw Error("Change size of contract array");
      }
      for (let date_i = 0; date_i < this.dates.length; date_i++) {
        if (date_i > MAXIMUM_DATE_PER_WEEK_NO) {
          throw Error("Change size of date per week array");
        }
        storage_list[contract_i][date_i] = this.get_product(contract_i, date_i, product_type);
      }
    }
  }

  private get_product(contract_index: number, date_index: number, product_type: string) {
    const contract = this.contracts[contract_index];
    const date = this.dates[date_index];
    let records = this.records.filter(record => record.contract_id === contract.id && record.date === date);
    let product_name = "";
    if (records.length !== 0) {
      records.forEach(record => {
          const product_storage = this.productsMapping[product_type].find(storage => record.product_store_id === storage.id);
          if (product_storage) {
            product_name = product_storage.product.name;
          }
        }
      )
    }
    return product_name;
  }


  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }
}
