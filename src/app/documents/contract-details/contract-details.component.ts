import {Component, OnDestroy, OnInit} from '@angular/core';
import {Contract} from "../contract.model";
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Subscription, switchMap} from "rxjs";
import {DAIRY_PRODUCT, FRUIT_VEG_PRODUCT} from "../../shared/namemapping.utils";
import { Config } from 'datatables.net-dt';
import 'datatables.net-responsive';

@Component({
  selector: 'app-contract-details',
  templateUrl: './contract-details.component.html'
})
export class ContractDetailsComponent implements OnInit, OnDestroy {
  contract!: Contract;
  school_id: number = -1;
  sub: Subscription | null = null;
  dtOptions: Config = {};
  FRUIT_VEG_PRODUCT: string;
  DAIRY_PRODUCT: string;
  base_url: string = 'dokumenty/umowy/';

  constructor(private store: Store<AppState>,
              private activeRoute: ActivatedRoute,
              private router: Router) {
    this.FRUIT_VEG_PRODUCT = FRUIT_VEG_PRODUCT;
    this.DAIRY_PRODUCT = DAIRY_PRODUCT;
    this.dtOptions = {
      order: [[1, 'desc']],
      searching: false,
      responsive: false,
      language: {url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/pl.json"},
    };
  }

  ngOnInit(): void {
    this.sub = this.activeRoute.params.pipe(
      switchMap((params: Params) => {
        if (params["school_id"]) {
          this.school_id = +params["school_id"];
        }
        return this.store.select("document");
      })).subscribe((documentState) => {
      const res = documentState.contracts.find((contract => {
        return contract.school.id === this.school_id;
      }));
      if (res) {
        this.contract = res;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  onEditContract(contract_id: number) {
    if (this.contract) {
      this.router.navigate([this.base_url + this.school_id + "/" + contract_id + "/edycja"]);
    }
  }

  onEditAnnex(annex_id: number) {
    if (this.contract) {
      this.router.navigate([this.base_url + this.school_id + "/" + this.contract.id + "/" + annex_id + "/edycja"]);
    }
  }

  onNewAnnex() {
    if (this.contract) {
      this.router.navigate([this.base_url + this.school_id + "/" + this.contract.id + "/nowy_aneks"]);
    }
  }

}
