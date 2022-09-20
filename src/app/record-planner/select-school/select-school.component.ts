import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {DualListComponent} from "angular-dual-listbox";
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";
import {switchMap} from "rxjs";
import {Contract} from "../../documents/contract.model";
import {
  DairyProductDemand,
  FruitVegProductDemand,
  SchoolWithRecordDemand
} from "../record.model";
import {RecordDataService} from "../record-data.service";

@Component({
  selector: 'app-select-school',
  templateUrl: './select-school.component.html'
})
export class SelectSchoolComponent implements OnInit {
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

  constructor(private activeRoute: ActivatedRoute,
              private router: Router,
              private store: Store<AppState>,
              private shareRecordDataService: RecordDataService) {
    this.sourceData = new Array<SchoolWithRecordDemand>();
    this.source = new Array<any>();
    this.confirmed = new Array<any>();
    this.unique_key = "nick";
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
    })
    this.sourceData.forEach(recordRequired => {
      this.source.push(recordRequired.nick);
    })
    this.shareRecordDataService.getData().forEach(record => {
      this.confirmed.push(record.nick);
    });
    console.log("confirmed");
    console.log(this.confirmed);
  };

  selectProducts() {
    if (this.confirmed.length === 0) {
      this.displayWarning = true;
    }else {
      this.displayWarning = false;
      let data = this.sourceData.filter(record => this.confirmed.find(confirmed_nick => record.nick === confirmed_nick));
      this.shareRecordDataService.setData(data);
      this.router.navigate(['../wybierz-produkty'], {relativeTo: this.activeRoute});
    }
  }

  private static isFruitVeg(contract: Contract) {
    return contract.fruitVeg_products !== 0;
  }

  private static isDairy(contract: Contract) {
    return contract.dairy_products !== 0;
  }
}

