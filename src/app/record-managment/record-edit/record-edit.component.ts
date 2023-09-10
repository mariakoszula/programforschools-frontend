import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {map} from "rxjs/operators";
import {Subscription, switchMap} from "rxjs";
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";
import {Record, RecordStates} from "../../record-planner/record.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ProductStore} from "../../programs/program.model";
import {DAIRY_PRODUCT, FRUIT_PRODUCT, FRUIT_VEG_PRODUCT, VEGETABLE_PRODUCT} from "../../shared/namemapping.utils";
import {School} from "../../schools/school.model";
import {Contract} from "../../documents/contract.model";
import {formatDate} from "@angular/common";
import {convert_date_from_backend_format} from "../../shared/date_converter.utils";
import * as RecordActions from "../../record-planner/store/record.action";

@Component({
  selector: 'app-record-edit',
  templateUrl: './record-edit.component.html'
})
export class RecordEditComponent implements OnInit, OnDestroy {
  sub: Subscription | null = null;
  currentRecord?: Record;
  currentSchool?: School;
  recordId: number = -1;
  allRecords: Record[] = [];
  recordForm: FormGroup;
  products: ProductStore[] = [];
  product: ProductStore | null | undefined = null;

  constructor(private store: Store<AppState>, private activeRoute: ActivatedRoute,
              private router: Router) {
        this.recordForm = new FormGroup({});
  }

  private setProducts() {
    if (!this.currentRecord) return;
    let res;
    if (this.currentRecord.product_type === FRUIT_PRODUCT || this.currentRecord.product_type === VEGETABLE_PRODUCT) {
      res = localStorage.getItem("currentFruitVegProducts");
    }
    if (this.currentRecord.product_type === DAIRY_PRODUCT) {
      res = localStorage.getItem("currentDiaryProducts");
    }
    if (res) this.products = JSON.parse(res);
    this.product = this.products.find(p => p.id === this.currentRecord?.product_store_id);
  }

  private setSchool() {
    let res = localStorage.getItem("currentContract");
    if (!res) return;
    let contracts: Contract[] = JSON.parse(res);
    let contract = contracts.find(c => c.id === this.currentRecord?.contract_id);
    if (contract) this.currentSchool = contract.school;
  }

  initFormValues() {
    let date = null;
    if (this.currentRecord?.date) {
      date = formatDate(convert_date_from_backend_format(this.currentRecord.date), "yyyy-MM-dd", 'en');
    }
    this.recordForm.addControl("productStore", new FormControl(this.product, [Validators.required]));
    this.recordForm.addControl("recordDate", new FormControl({value: date, disabled: true}, [Validators.required]));

  }

  ngOnInit(): void {
    this.sub = this.activeRoute.params.pipe(
      map((params: Params) => {
        if (params["id"]) {
          return +params["id"];
        }
        return -1;
      }),
      switchMap((record_id: number) => {
        this.recordId = record_id;
        return this.store.select("record");
      })).subscribe(recordState => {

      this.currentRecord = recordState.records.find(r => r.id === this.recordId);
      this.setProducts();
      this.setSchool();
      if (!this.currentRecord || !this.products || !this.currentSchool) {
        this.router.navigate([".."]);
      }
      this.allRecords = recordState.records.filter(r => r.contract_id === this.currentRecord?.contract_id
        && ((r.product_type === DAIRY_PRODUCT && r.product_type === this.currentRecord?.product_type)  ||
          (r.product_type === FRUIT_PRODUCT || r.product_type === VEGETABLE_PRODUCT)));
    });
    this.initFormValues();
  }

  isMinProductValueExceeded(record: Record) {
      let records = this.allRecords.filter(r => r.product_store_id === record.product_store_id);
      return records.length + 1 > this.products.filter(p => p.id === record.product_store_id)[0].min_amount;
  }

  updateRecord() {
    if (!this.currentRecord) return;
    let _state = RecordStates.PLANNED;
    if (this.currentRecord.delivery_date !== null){
      _state = RecordStates.DELIVERY_PLANNED
    }
    let updated_record = {
      ...this.currentRecord,
      state: _state,
      product_store_id: this.recordForm.value.productStore.id
    };
    let confirmed = true;
    if (this.isMinProductValueExceeded(updated_record)){
      confirmed  = confirm("Przekroczono liczbę wystawionych produktów, czy zatwierdzić?");
    }
    if (!confirmed) return;
    this.store.dispatch(new RecordActions.UpdateRecord(updated_record));
    this.router.navigate([".."], {relativeTo: this.activeRoute});
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
