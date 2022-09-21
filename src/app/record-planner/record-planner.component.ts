import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ProductStore, Week} from "../programs/program.model";
import {AppState} from "../store/app.reducer";
import {Store} from "@ngrx/store";
import {Subscription, switchMap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {RecordDataService} from "./record-data.service";
import {Record} from "./record.model";
import {Contract} from "../documents/contract.model";
import * as RecordActions from "./store/record.action";

@Component({
  selector: 'app-record-planner',
  templateUrl: './record-planner.component.html'
})
export class RecordPlannerComponent implements OnInit, OnDestroy, OnChanges {
  weeks: Week[] = [];
  sub: Subscription | null = null;
  recordSub: Subscription | null = null;
  selectedWeek: Week | null = null;
  isLoading: boolean = false;
  records: Record[] = [];
  contracts: Contract[] = [];
  fruitVegProducts: ProductStore[] = [];
  dairyProducts: ProductStore[] = [];

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
    if (this.recordSub) this.recordSub.unsubscribe();
    this.recordDataService.resetDates();
  }

  ngOnInit(): void {
    this.sub = this.store.select("program").pipe(
      switchMap(programState => {
        this.fruitVegProducts = programState.fruitVegProducts;
        this.dairyProducts = programState.dairyProducts;
        this.weeks = programState.weeks;
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
      }
    );
  }

  selectWeek($event: any, id: number) {
    let clickedElement = $event.target;
    if (clickedElement.nodeName === "BUTTON") {
      let isCertainButtonAlreadyActive = clickedElement.parentElement.querySelector(".active");
      if (isCertainButtonAlreadyActive) {
        isCertainButtonAlreadyActive.classList.remove("active");
      }
      clickedElement.className += " active";
    }
    let foundWeek = this.weeks.find(week => week.id === id);
    if (foundWeek) {
      this.selectedWeek = foundWeek;
      this.recordDataService.setDates(this.selectedWeek);
      this.router.navigate([id], {relativeTo: this.activeRoute});
    }
  }
  fetchRecords() {
    this.store.dispatch(new RecordActions.Fetch());
  }
}
