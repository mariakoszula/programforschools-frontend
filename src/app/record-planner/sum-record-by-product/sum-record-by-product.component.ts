import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ProductStore, Program} from "../../programs/program.model";
import {RecordDataService} from "../record-data.service";
import {Contract} from "../../documents/contract.model";
import {Record} from "../record.model";
import {DAIRY_PRODUCT, FRUIT_VEG_PRODUCT} from "../../shared/namemapping.utils";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-sum-record-by-product',
  templateUrl: './sum-record-by-product.component.html'
})
export class SumRecordByProductComponent implements OnInit, OnChanges {
  @Input() records: Record[] = [];
  @Input() contracts: Contract[] = [];
  @Input() fruitVegProducts: ProductStore[] = [];
  @Input() dairyProducts: ProductStore[] = [];
  sub: Subscription | null = null;
  program!: Program;

  FRUIT_VEG_PRODUCT = FRUIT_VEG_PRODUCT;
  DAIRY_PRODUCT = DAIRY_PRODUCT;

  // contract_id -> amount
  totalFruitVegAmount: Map<number, number> = new Map<number, number>();
  totalDairyAmount: Map<number, number> = new Map<number, number>();

  constructor(private recordDataService: RecordDataService) {
  }

  get_max(program: Program | null, product_type: string) {
    if (program) {
      if (product_type === FRUIT_VEG_PRODUCT && program.fruitVeg_amount) {
        return program.fruitVeg_amount;
      }
      if (product_type === DAIRY_PRODUCT && program.dairy_amount) {
        return program.dairy_amount;
      }
    }
    return 0;
  }

  private updateTotalAmounts(contract: Contract, amount: number, total: Map<number, number>) {
    let val = amount;
    if (total.has(contract.id)) {
      val += total.get(contract.id) || 0;
    }
    total.set(contract.id, val);
  }

  get_product_amount(product: ProductStore, contract: Contract) {
    return this.records.filter(record => record.contract_id === contract.id && record.product_store_id === product.id).length;
  }

  get_total(total: Map<number, number>, contract: Contract) {
    if (total.has(contract.id)) {
      return total.get(contract.id);
    }
    return 0;
  }

  getColor(amount: number | undefined, expected_amount: number | null) {
    if (expected_amount && amount === expected_amount) {
      return '#2ECC71';
    }
    if (expected_amount && amount && amount > expected_amount) {
      return '#FF4136';
    }
    return 'transparent';
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.program = this.recordDataService.getProgram();
    this.totalFruitVegAmount.clear();
    this.totalDairyAmount.clear();
    for (let contract of this.contracts) {
      for (let fruit of this.fruitVegProducts) {
        this.updateTotalAmounts(contract, this.get_product_amount(fruit, contract), this.totalFruitVegAmount);
      }
      for (let dairy of this.dairyProducts) {
        this.updateTotalAmounts(contract, this.get_product_amount(dairy, contract), this.totalDairyAmount);
      }
    }
  }

  ngOnInit(): void {

  }


}
