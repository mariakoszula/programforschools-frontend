import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.reducer";
import {switchMap} from "rxjs";
import {DAIRY_PRODUCT, FRUIT_VEG_PRODUCT} from "../../shared/namemapping.utils";
import {FormGroup} from "@angular/forms";
import {Application, Contract} from "../contract.model";
import {DualListComponent} from "angular-dual-listbox";
import {Week} from "../../programs/program.model";
import {School} from "../../schools/school.model";
import {CreateApplication} from "../store/documents.action";



@Component({
  selector: 'app-application-add',
  templateUrl: './application-add.component.html'
})
export class ApplicationAddComponent implements OnInit {
  appType: string = "";
  unique_key_weeks: string;
  unique_key_school: string;
  contracts: Contract[] = [];
  allSchools: Array<School>;
  selectedSchools: Array<School>
  allWeeks: Array<Week>;
  selectedWeeks: Array<Week>;
  appAddForm: FormGroup;
  format_school = {
    add: 'Dodaj Szkoły', remove: 'Usuń Szkoły', locale: 'pl', all: 'Zanacz wszystkie', none: "Odznacz wszystkie",
    draggable: true, direction: DualListComponent.LTR
  }
  format_weeks = {
    add: 'Dodaj Tydzień', remove: 'Usuń Tydzień', locale: 'pl', all: 'Zanacz wszystkie', none: "Odznacz wszystkie",
    draggable: true, direction: DualListComponent.LTR
  }
  constructor(private activeRoute: ActivatedRoute, private router: Router, private store: Store<AppState>,) {
    this.appAddForm = new FormGroup<any>({});
    this.allSchools = new Array<School>();
    this.selectedSchools = new Array<School>();
    this.allWeeks = new Array<Week>();
    this.selectedWeeks = new Array<Week>();
    this.unique_key_school = "nick";
    this.unique_key_weeks = "week_no";
  }

  ngOnInit(): void {
    this.activeRoute.params.pipe(
      switchMap((param: Params) => {
        this.appType = param["type"];
        return this.store.select('program');
      }),
      switchMap(program => {
        this.allWeeks = program.weeks;
        return this.store.select('document');
      })).subscribe(documentState => {
        let filtered_contracts: Contract[] = [];
        if (this.appType === DAIRY_PRODUCT) {
          filtered_contracts = documentState.contracts.filter((contract: Contract) => {
              return contract.dairy_products !== 0;
             });
        } else if(this.appType === FRUIT_VEG_PRODUCT) {
          filtered_contracts = documentState.contracts.filter((contract: Contract) => {
              return contract.fruitVeg_products !== 0;
             });
        }
        this.contracts = filtered_contracts;
        for(let contract of filtered_contracts) {
          this.allSchools.push(contract.school);
        }
        let prevApp = documentState.applications.filter((app: Application) => {
          return app.type === this.appType;
        });
        if (prevApp){
          // NOTE: can take first as all should have the same list of schools in theory
          for(let contract of prevApp[0].contracts){
            this.selectedSchools.push(contract.school);
          }
        }
    });
  }

  public is_data_selected() {
    return this.selectedWeeks.length !== 0 && this.selectedSchools.length !== 0;
  }
  public addApplication() {
    let selectedContracts: Contract[] = this.contracts.filter(
      (contract: Contract) => {
          for (let school of this.selectedSchools) {
            if (contract.school.nick === school.nick){
              return true;
            }
          }
          return false;
          }
    );
    this.store.dispatch(new CreateApplication({
      type: this.appType,
      contracts: selectedContracts,
      weeks: this.selectedWeeks
    }));
    this.router.navigate(["dokumenty/wnioski"]);
  }

}
