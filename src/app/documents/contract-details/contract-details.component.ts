import {Component, OnDestroy, OnInit} from '@angular/core';
import {Contract} from "../contract.model";
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Subscription, switchMap} from "rxjs";
import {DAIRY_PRODUCT, FRUIT_VEG_PRODUCT} from "../../shared/namemapping.utils";

@Component({
  selector: 'app-contract-details',
  templateUrl: './contract-details.component.html'
})
export class ContractDetailsComponent implements OnInit, OnDestroy {
  contract: Contract | null = null;
  school_id: number = -1;
  sub: Subscription | null = null;
  dtOptions: DataTables.Settings = {};
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
      responsive: false,
      searching: false,
      language: {"url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Polish.json"},
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

  onNewAnnex(contract_id: number) {
    if (this.contract) {
      this.router.navigate([this.base_url + this.school_id + "/" + this.contract.id + "/nowy_aneks"]);
    }
  }

}
