import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {DualListComponent} from "angular-dual-listbox";
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";
import {Subscription, switchMap} from "rxjs";
import {Contract} from "../../documents/contract.model";
import {
  AdditionRecordsResponse,
  DairyProductDemand,
  FruitVegProductDemand,
  SchoolWithRecordDemand
} from "../record.model";
import {RecordDataService} from "../record-data.service";


const recordInfoMapping: string[] = [
  "Dodano pomyślnie",
  "Istnieje już WZ dla produktu dla zadanej daty",
  "Przekroczono możliwą liczbę produktu",
  "Brak dzieci w umowie dla podanego produktu",
  "Wystąpił nieznany problem"
]

@Component({
  selector: 'app-select-school',
  templateUrl: './select-school.component.html'
})
export class SelectSchoolComponent implements OnInit, OnDestroy {
  private sourceData: Array<SchoolWithRecordDemand>;
  date?: string;
  source: Array<any>;
  confirmed: Array<any>;
  unique_key: string;
  displayWarning: boolean = false;
  format = {
    add: 'Dodaj', remove: 'Usuń', locale: 'pl', all: 'Zanacz wszystkie', none: "Odznacz wszystkie",
    draggable: true, direction: DualListComponent.LTR
  }
  failedRecords: AdditionRecordsResponse | null = null;
  failedRecordSub: Subscription | null = null;
  recordDemandSub: Subscription | null = null;
  error: string = "";

  constructor(private activeRoute: ActivatedRoute,
              private router: Router,
              private store: Store<AppState>,
              private recordDataService: RecordDataService) {
    this.sourceData = new Array<SchoolWithRecordDemand>();
    this.source = new Array<any>();
    this.confirmed = new Array<any>();
    this.unique_key = "nick";
    this.failedRecords = this.recordDataService.getFailedRecords();
    if (this.failedRecords) this.handle_failed_records();
  }

  ngOnDestroy(): void {
    if (this.failedRecordSub) this.failedRecordSub.unsubscribe();
    if (this.recordDemandSub) this.recordDemandSub.unsubscribe();
  }

  private get_failed_schools_and_set_error() {
    let failed_school_nick: string[] = [];
    if (this.failedRecords && this.failedRecords.records.length !== 0) {
      this.error = `WZ: ${this.failedRecords.date}\n`;
      this.failedRecords.records.forEach(failedRecordResult => {
        failed_school_nick.push(failedRecordResult.nick);
        this.error += `${failedRecordResult.nick}: [${failedRecordResult.product}] - ${recordInfoMapping[failedRecordResult.result]}\n`
      });
    } else {
      this.error = "";
      this.failedRecords = null;
    }
    return failed_school_nick;
  }

  private handle_failed_records() {
    this.resetConfirmed();
    this.get_failed_schools_and_set_error().forEach((nick: string) => this.confirmed.push(nick));
  }


  ngOnInit(): void {
    this.activeRoute.params.pipe(
      switchMap((param: Params) => {
        this.date = param["date"];
        return this.store.select('document');
      })).subscribe(documentState => {
      let filtered_contracts = documentState.contracts.filter((contract: Contract) => {
        return SelectSchoolComponent.isFruitVeg(contract) || SelectSchoolComponent.isDairy(contract);
      });
      filtered_contracts.forEach(contract => {
        let new_record_school = new SchoolWithRecordDemand(
          contract.school.nick,
          new FruitVegProductDemand(SelectSchoolComponent.isFruitVeg(contract)),
          new DairyProductDemand(SelectSchoolComponent.isDairy(contract)));
        this.sourceData.push(new_record_school);
      })
    });

    this.failedRecordSub = this.recordDataService.failedRecordChanged.subscribe(failedRecords => {
      this.failedRecords = failedRecords;
      this.handle_failed_records()
    });
    this.recordDemandSub = this.recordDataService.recordDemandChanged.subscribe(recordDemand => {
      recordDemand.forEach(record => {
        this.confirmed.push(record.nick);
      });
    });
    this.sourceData.forEach(recordRequired => {
      this.source.push(recordRequired.nick);
    });
  };

  selectProducts() {
    if (this.confirmed.length === 0) {
      this.displayWarning = true;
    } else {
      this.displayWarning = false;
      let data = this.sourceData.filter(record => this.confirmed.find(confirmed_nick => record.nick === confirmed_nick));
      this.recordDataService.setRecordDemand(data);
      this.router.navigate(['../wybierz-produkty'], {relativeTo: this.activeRoute});
    }
  }

  private static isFruitVeg(contract: Contract) {
    return contract.fruitVeg_products !== 0;
  }

  private static isDairy(contract: Contract) {
    return contract.dairy_products !== 0;
  }

  private resetConfirmed() {
    this.confirmed = [];
  }
}

