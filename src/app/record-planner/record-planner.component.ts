import {Component, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {ProductStore, Week} from "../programs/program.model";
import {AppState} from "../store/app.reducer";
import {Store} from "@ngrx/store";
import {Subscription, switchMap} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {RecordDataService} from "./record-data.service";
import {Record} from "./record.model";
import {Contract} from "../documents/contract.model";
import * as RecordActions from "./store/record.action";
import * as DocumentsActions from "../documents/store/documents.action";
import {CutYearFromDate} from "../shared/cut-date.pipe";
import {DAIRY_PRODUCT, FRUIT_PRODUCT, VEGETABLE_PRODUCT} from "../shared/namemapping.utils";

@Component({
  selector: 'app-record-planner',
  templateUrl: './record-planner.component.html'
})
export class RecordPlannerComponent implements OnInit, OnDestroy, OnChanges {
  sub: Subscription | null = null;
  isLoading: boolean = false;
  records: Record[] = [];
  contracts: Contract[] = [];
  fruitVegProducts: ProductStore[] = [];
  dairyProducts: ProductStore[] = [];
  selectedWeek: Week | undefined = undefined;
  selectedWeekId: number | null = null;
  bulkSkippedInfo: string | null = null;

  constructor(private store: Store<AppState>,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private recordDataService: RecordDataService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
    this.recordDataService.resetDates();
  }

  ngOnInit(): void {
    this.sub = this.activeRoute.params.pipe(
      switchMap((params: Params) => {
        if (params['week_id']) {
          this.selectedWeekId = +params['week_id'];
        } else {
          this.selectedWeekId = null;
        }
        return this.store.select("program");
      }),
      switchMap(programState => {
        this.fruitVegProducts = programState.fruitVegProducts;
        this.dairyProducts = programState.dairyProducts;
        if (programState.indexOfSelectedProgram !== -1) {
          this.recordDataService.setProgram(programState.programs[programState.indexOfSelectedProgram]);
        }
        if (this.selectedWeekId !== null) {
          this.selectedWeek = programState.weeks.find(week => week.id === this.selectedWeekId);
          if (this.selectedWeek) {
            this.recordDataService.setDates(this.selectedWeek);
          }
        }
        return this.store.select("document");
      }),
      switchMap(documentState => {
          this.contracts = documentState.contracts;
          return this.store.select("record")
        }
      )).subscribe(recordState => {
        this.isLoading = recordState.isLoading;
        this.recordDataService.setFailedRecords(recordState.recordsFailedResponse);
        this.records = recordState.records;
        this.bulkSkippedInfo = recordState.bulkSkippedInfo
      }
    );
  }

  onSelectWeek(selectedWeek: Week) {
    this.selectedWeek = selectedWeek;
    this.selectedWeekId = selectedWeek.id;
    this.recordDataService.setDates(this.selectedWeek);
    this.bulkSkippedInfo = null;
    this.router.navigate([this.selectedWeek.id], {relativeTo: this.activeRoute});
  }

  fetchRecords() {
    this.store.dispatch(new RecordActions.Fetch());
  }

  summaryGeneration() {
    if (this.selectedWeekId && this.selectedWeek){
        this.store.dispatch(new DocumentsActions.GenerateWeekSummary(this.selectedWeek));
    }
  }

  bulkDeleteFruitVeg()
  {
    const pipe = new CutYearFromDate();
    const start_date = this.selectedWeek?.start_date ? pipe.transform(this.selectedWeek.start_date) : '';
    const end_date = this.selectedWeek?.end_date ? pipe.transform(this.selectedWeek.end_date) : '';

   if (confirm("Czy chesz usunąć rozpisane warzywa-owoce dla tygodnia: " + this.selectedWeek?.week_no + " " + start_date + "-" + end_date  )) {
     if (this.selectedWeek) {
        this.store.dispatch(new RecordActions.BulkDelete(this.records.filter((record: Record) => {
            return record.week_id === this.selectedWeek?.id && (record.product_type === FRUIT_PRODUCT || record.product_type === VEGETABLE_PRODUCT);
        })));
      }
    }
  }
  bulkDeleteDiary()
  {
    const pipe = new CutYearFromDate();
    const start_date = this.selectedWeek?.start_date ? pipe.transform(this.selectedWeek.start_date) : '';
    const end_date = this.selectedWeek?.end_date ? pipe.transform(this.selectedWeek.end_date) : '';

   if (confirm("Czy chesz usunąć rozpisany nabiał dla tygodnia: " + this.selectedWeek?.week_no + " " + start_date + "-" + end_date  )) {
      if (this.selectedWeek) {
          this.store.dispatch(new RecordActions.BulkDelete(this.records.filter((record: Record) => {
            return record.week_id === this.selectedWeek?.id && record.product_type === DAIRY_PRODUCT;
        })));
      }
    }
  }

  bulkDelete() {
      const pipe = new CutYearFromDate();
      const start_date = this.selectedWeek?.start_date ? pipe.transform(this.selectedWeek.start_date) : '';
      const end_date = this.selectedWeek?.end_date ? pipe.transform(this.selectedWeek.end_date) : '';

      if (confirm("Czy chesz usunąć rozpisane produkty dla tygodnia: " + this.selectedWeek?.week_no + " " + start_date + "-" + end_date)) {
          if (this.selectedWeek) {
              this.store.dispatch(new RecordActions.BulkDelete(this.records.filter((record: Record) => {
                  return record.week_id === this.selectedWeek?.id;
              })));
          }
      }
  }
}
