import {Component, OnDestroy, OnInit} from '@angular/core';
import {Contract} from "../contract.model";
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Subscription, switchMap} from "rxjs";

@Component({
  selector: 'app-contract-details',
  templateUrl: './contract-details.component.html'
})
export class ContractDetailsComponent implements OnInit, OnDestroy {
  contract: Contract | null = null;
  school_id: number = -1;
  sub: Subscription | null = null;
  dtOptions: DataTables.Settings = {};

  constructor(private store: Store<AppState>,
              private activeRoute: ActivatedRoute,
              private router: Router) {
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
      this.router.navigate([contract_id + "/edycja"],
        {relativeTo: this.activeRoute});
    }
  }

  onEditAnnex(annex_id: number) {
    if (this.contract) {
      this.router.navigate([this.contract.id + "/" + annex_id + "/edycja"],
        {relativeTo: this.activeRoute});
    }
  }

  onNewAnnex(contract_id: number) {
    if (this.contract) {
      this.router.navigate([this.contract.id + "/nowy_aneks"],
        {relativeTo: this.activeRoute});
    }
  }

}
