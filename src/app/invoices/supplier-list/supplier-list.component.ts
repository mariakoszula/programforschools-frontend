import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import { Store} from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import {Supplier} from "../invoice.model";
import {State} from "../store/invoice.reducer";

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html'
})
export class SupplierListComponent implements OnInit, OnDestroy{
  suppliers: Supplier[] = [];
  suppliersDtOptions: DataTables.Settings = {};
  suppliersSub: Subscription | null = null;

    constructor(private router: Router,
              private activeRoute: ActivatedRoute,
              private store: Store<fromApp.AppState>) {
  }
  ngOnDestroy(): void {
    if (this.suppliersSub){
      this.suppliersSub.unsubscribe();
    }
  }


  ngOnInit(): void {
    this.suppliersSub = this.store.select("invoice").subscribe(
      (invoiceState: State) => {
        this.suppliers = invoiceState.suppliers;
      }
    )
    this.suppliersDtOptions = {
        responsive: false,
        searching: false,
        language: {url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/pl.json"},
      };

  }
  addSupplier() {
    this.router.navigate(["faktury/dostawcy/nowy"]);
  }
  onEditSupplier(supplier_id: number) {
        this.router.navigate(["faktury/dostawcy/" + supplier_id + '/edycja']);
  }
}
