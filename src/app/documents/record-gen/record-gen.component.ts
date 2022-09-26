import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ProductStore, Week} from "../../programs/program.model";
import {Record} from "../../record-planner/record.model";
import {Contract} from "../contract.model";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.reducer";
import {Subscription, switchMap} from "rxjs";
import {RecordDataService} from "../../record-planner/record-data.service";
import * as DocumentsActions from "../store/documents.action";
import {convert_date_to_backend_format} from "../../shared/date_converter.utils";

@Component({
  selector: 'app-record-gen',
  templateUrl: './record-gen.component.html'
})
export class RecordGenComponent implements OnInit {
  error: string = "";
  isGenerating: boolean = false;
  sub: Subscription | null = null;
  deliveryForm: FormGroup;
  weeks: Week[] = [];
  selectedRecords: Record[] = [];
  records: Record[] = [];
  contracts: Contract[] = [];
  fruitVegProducts: ProductStore[] = [];
  dairyProducts: ProductStore[] = [];
  selectedWeek: Week | null = null;
  isClickableView: boolean = true;

  constructor(private store: Store<AppState>,
              private recordDataService: RecordDataService) {
    this.deliveryForm = new FormGroup({
      "delivery_date": new FormControl("", [Validators.required]),
      "driver": new FormControl("", [Validators.required]),
      "comment": new FormControl("",)
    });
  }

  ngOnInit(): void {
    this.sub = this.store.select("program").pipe(
      switchMap(programState => {
        this.fruitVegProducts = programState.fruitVegProducts;
        this.dairyProducts = programState.dairyProducts;
        return this.store.select("document");
      }),
      switchMap(documentState => {
          this.contracts = documentState.contracts;
          this.isGenerating = documentState.isGenerating;
          return this.store.select("record")
        }
      )).subscribe(recordState => {
        this.records = recordState.records;
      }
    );
  }

  onSubmitDelivery() {
    if (!this.deliveryForm) {
      return;
    }
    if (this.selectedRecords.length === 0) {
      this.error = "Należy wybrać przynajmniej jeden produkt."
    } else {
      this.error = "";
      const comment = this.deliveryForm.value.comment ? this.deliveryForm.value.comment : "";
      this.store.dispatch(new DocumentsActions.GenerateDelivery(this.selectedRecords,
        convert_date_to_backend_format(this.deliveryForm.value.delivery_date),
        this.deliveryForm.value.driver, comment));
    }
  }

  onSelectRecords(selectedRecords: Record[]) {
    this.selectedRecords = selectedRecords;
  }

  onSelectWeek(selectedWeek: Week) {
    this.selectedWeek = selectedWeek;
    this.recordDataService.setDates(this.selectedWeek);
  }

  get_records() {
    if (this.selectedWeek) {
      return this.records.filter(record => record.week_id == this.selectedWeek?.id);
    }
    return this.records;
  }
}
