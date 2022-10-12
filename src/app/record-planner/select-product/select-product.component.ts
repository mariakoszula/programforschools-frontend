import {Component, OnInit} from '@angular/core';
import {Record, SchoolWithRecordDemand} from "../record.model";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.reducer";
import {switchMap} from "rxjs";
import {ProductStore} from "../../programs/program.model";
import {RecordDataService} from "../record-data.service";
import * as RecordActions from "../store/record.action";
import {Contract} from "../../documents/contract.model";

@Component({
  selector: 'app-select-product',
  templateUrl: './select-product.component.html'
})
export class SelectProductComponent implements OnInit {
  fruitVegSuffix: string = "fruitVeg_";
  dairySuffix: string = "dairy_";
  recordRequiredForSchools?: Array<SchoolWithRecordDemand>;
  date?: string;
  records?: Record[];
  contracts?: Contract[];
  displayWarning: boolean = false;
  fruitVegProducts: ProductStore[] = [];
  dairyProducts: ProductStore[] = [];
  schoolsWithoutSelectedProduct: string[] = [];
  messageBody: string = ""

  constructor(private activeRoute: ActivatedRoute,
              private router: Router,
              private store: Store<AppState>,
              private shareRecordDataService: RecordDataService) {
  }

  reached_min_amount(product: ProductStore, school_nick: string): boolean {
    const contract: Contract | undefined = this.contracts?.find(contract => contract.school.nick === school_nick);
    if (contract) {
      let records_for_school = this.records?.filter(record => record.contract_id === contract?.id &&
        record.product_store_id === product.id);
      if (records_for_school) {
        return records_for_school.length >= product.min_amount;
      }
    }
    return false;
  }

  __all_reached_min_amount(products: ProductStore[], school_nick: string): boolean {
    let results = [];
    for (let product of products) {
      results.push(this.reached_min_amount(product, school_nick));
    }
    return results.every( result => result);
  }

  ngOnInit(): void {
    this.activeRoute.params.pipe(
      switchMap((param: Params) => {
        this.date = param["date"];
        return this.store.select('program');
      }),
      switchMap(programState => {
        this.fruitVegProducts = programState.fruitVegProducts;
        this.dairyProducts = programState.dairyProducts;
        return this.store.select("record");
      }),
      switchMap(recordState => {
        this.records = recordState.records;
        console.log(this.records);
        return this.store.select("document");
      })).subscribe(documentState => {
      this.contracts = documentState.contracts;
      this.recordRequiredForSchools = this.shareRecordDataService.getRecordDemand();
      this.recordRequiredForSchools.forEach(recordRequired => {
        if (recordRequired.fruitVeg.isRequired && this.__all_reached_min_amount(this.fruitVegProducts, recordRequired.nick)) {
            recordRequired.fruitVeg.isRequired = false;
        }
        if (recordRequired.dairy.isRequired && this.__all_reached_min_amount(this.dairyProducts, recordRequired.nick)) {
          recordRequired.dairy.isRequired = false;
        }
      });
    });
  }

  onSend(values: any) {
    if (this.missing_product_selection(values)) {
      this.displayWarning = true;
      this.messageBody = this.schoolsWithoutSelectedProduct.join(", ");
    } else {
      this.messageBody = "";
      this.displayWarning = false;
      if (this.date && this.recordRequiredForSchools) {
        this.store.dispatch(new RecordActions.AddRecords({
          date: this.date,
          recordsDemand: this.recordRequiredForSchools
        }));
      }
    }
  }

  private missing_product_selection(formValues: any) {
    this.schoolsWithoutSelectedProduct = [];
    let transferValues: { [key: string]: string } = formValues;
    this.recordRequiredForSchools?.forEach(record => {
      if (record.fruitVeg.isRequired) {
        let key = this.fruitVegSuffix + record.nick;
        if (key in transferValues) {
          record.fruitVeg.name = transferValues[key];
        }
      }
      if (record.dairy.isRequired) {
        let key = this.dairySuffix + record.nick;
        if (key in transferValues) {
          record.dairy.name = transferValues[key];
        }
      }
      if (SelectProductComponent.required_data_not_selected(record)) {
        this.schoolsWithoutSelectedProduct.push(record.nick);
      }
    })
    return this.schoolsWithoutSelectedProduct.length !== 0;
  }

  private static required_data_not_selected(record: SchoolWithRecordDemand) {
    return (record.fruitVeg.isRequired && record.fruitVeg.name === "")
      && (record.dairy.isRequired && record.dairy.name === "")
      || (!record.fruitVeg.isRequired && (record.dairy.isRequired && record.dairy.name === ""))
      || (!record.dairy.isRequired && (record.fruitVeg.isRequired && record.fruitVeg.name === ""))
  }
}
