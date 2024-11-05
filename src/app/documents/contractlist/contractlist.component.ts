import {AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Contract} from "../contract.model";
import {State} from "../store/documents.reducer";
import {Store} from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import {Subject, Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {DataTableDirective} from "angular-datatables";
import {FRUIT_VEG_PRODUCT, DAIRY_PRODUCT} from "../../shared/namemapping.utils";
import { Config } from 'datatables.net';
import 'datatables.net-responsive';

@Component({
  selector: 'app-contractlist',
  templateUrl: './contractlist.component.html'
})
export class ContractlistComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @ViewChild(DataTableDirective, {static: false}) dtElement?: DataTableDirective;

  dtOptions: Config = {};
  contracts: Contract[] = [];
  programSub: Subscription | null = null;
  dtTrigger: Subject<Config> = new Subject<Config>();
  FRUIT_VEG_PRODUCT: string;
  DAIRY_PRODUCT: string;

  constructor(private store: Store<fromApp.AppState>,
              private router: Router,
              private activeRoute: ActivatedRoute) {
    this.FRUIT_VEG_PRODUCT = FRUIT_VEG_PRODUCT;
    this.DAIRY_PRODUCT = DAIRY_PRODUCT;
  }

  ngOnChanges():void {
    console.log("ngOnChanges");
    this.dtTrigger.next(this.dtOptions);
  }
  ngOnDestroy(): void {
    console.log("ngOnDestroy");
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(this.dtOptions);
  }


  ngOnInit(): void {
    console.log("titit");
    this.dtOptions = {
      paging: true,
      pagingType: 'full_numbers',
      pageLength: 50,
      responsive: true,
      destroy: true,
      language: {url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/pl.json"},
    };
    this.store.select("document").subscribe(
      (contractState: State) => {
        this.contracts = contractState.contracts;
        console.log("nginit");
        this.rerender();
      }
    );

  }

  onEdit(school_id: number) {
    this.router.navigate(["dokumenty/umowy/" + school_id]);
  }

  get_latest_fruitVeg_product(contract: Contract) {
    if (contract.annex.length === 0)
      return contract.fruitVeg_products;
    return contract.annex[0].fruitVeg_products;
  }

  get_latest_diary_product(contract: Contract) {
    if (contract.annex.length === 0)
      return contract.dairy_products;
    return contract.annex[0].dairy_products;
  }

  get_sum_fruitVeg() : number{
    return this.contracts.reduce((total, item: Contract) => total + item.fruitVeg_products, 0);
  }

  get_sum_diary() : number
  {
    return this.contracts.reduce((total, item: Contract) => total + item.dairy_products, 0);
  }

  get_sum_fruitVeg_latest(): number
  {
    return this.contracts.reduce((total, item: Contract) => total + this.get_latest_fruitVeg_product(item), 0);
  }

  get_sum_diary_latest(): number
  {
    return this.contracts.reduce((total, item: Contract) => total + this.get_latest_diary_product(item), 0);
  }
  rerender(): void {
    console.log("eet1");
    this.dtElement?.dtInstance.then(dtInstance => {
      console.log("test");
      // Destroy the table first
      dtInstance.clear().destroy(false);
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(this.dtOptions);
    });
  }

  onSelectContract(contract: Contract) {
    this.onEdit(contract.school.id);
  }
}
