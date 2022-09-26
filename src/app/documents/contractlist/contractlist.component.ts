import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Contract} from "../contract.model";
import {State} from "../store/documents.reducer";
import {Store} from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import {Subject, Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {DataTableDirective} from "angular-datatables";

@Component({
  selector: 'app-contractlist',
  templateUrl: './contractlist.component.html'
})
export class ContractlistComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;

  contractDtOptions: DataTables.Settings = {};
  contracts: Contract[] = [];
  programSub: Subscription | null = null;
  dtTrigger: Subject<any> = new Subject();

  constructor(private store: Store<fromApp.AppState>,
              private router: Router,
              private activeRoute: ActivatedRoute) {
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(true);
  }


  ngOnInit(): void {
    this.store.select("document").subscribe(
      (contractState: State) => {
        this.contracts = contractState.contracts;
      }
    );
    this.contractDtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      responsive: true,
      language: {"url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Polish.json"}
    };
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

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next(true);
    });
  }

  onSelectContract(contract: Contract) {
     this.onEdit(contract.school.id);
  }
}
