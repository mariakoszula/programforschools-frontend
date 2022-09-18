import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {DualListComponent} from "angular-dual-listbox";
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";
import {switchMap} from "rxjs";
import {Contract} from "../../documents/contract.model";
import {RecordRequiredForSchool} from "../record.model";

@Component({
  selector: 'app-select-school',
  templateUrl: './select-school.component.html'
})
export class SelectSchoolComponent implements OnInit {
  private sourceData: Array<RecordRequiredForSchool>;
  date?: string;
  source: Array<any>;
  confirmed: Array<any>;
  unique_key: string;
  format = { add: 'Dodaj', remove: 'Usuń', locale: 'pl', all: 'Zanacz wszystkie', none: "Odznacz wszystkie",
  draggable: true, direction: DualListComponent.LTR}

  constructor(private activeRoute: ActivatedRoute,
              private store: Store<AppState>) {
    this.sourceData = new Array<RecordRequiredForSchool>();
    this.source = new Array<any>();
    this.confirmed = new Array<any>();
    this.unique_key = "nick";
  }

  ngOnInit(): void {
     this.activeRoute.params.pipe(
      switchMap((param: Params) => {
        this.date=param["date"];
        return this.store.select('document');
      })).subscribe(documentState => {
       let filtered_contracts = documentState.contracts.filter((contract: Contract) => {
         return this.isFruitVeg(contract) || this.isDairy(contract);
       });
       filtered_contracts.forEach( contract => {
         let new_record_school = new RecordRequiredForSchool(contract.school.nick, this.isFruitVeg(contract), this.isDairy(contract));
         this.sourceData.push(new_record_school);
       })
     })
    this.sourceData.forEach(recordRequired => {
      this.source.push(recordRequired.nick);
    })
  };

  isFruitVeg(contract: Contract) {
    return contract.fruitVeg_products !== 0;
  }
  isDairy(contract: Contract) {
    return contract.dairy_products !== 0;
  }
}

