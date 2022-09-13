import {Component, OnInit} from '@angular/core';
import {Contract} from "../contract.model";
import {State} from "../store/documents.reducer";
import {Store} from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-contractlist',
  templateUrl: './contractlist.component.html',
})
export class ContractlistComponent implements OnInit {
  contractDtOptions: DataTables.Settings = {};
  contracts: Contract[] = [];
  programSub: Subscription | null = null;

  constructor(private store: Store<fromApp.AppState>,
              private router: Router,
              private activeRoute: ActivatedRoute) {

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
      language: {"url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Polish.json"},
      rowCallback: (row: Node, data: Object | any, index: number) => {
        $('td', row).off('click');
        $('td', row).on('click', () => {
          const contract_no = data.at(0);
          const contract = this.contracts.find((contract: Contract) => {
            return contract.contract_no === contract_no;
          })
          if (contract){
            this.onEdit(contract.school.id);
          }
        });
        return row;
      }
    };
  }

  onEdit(school_id: number) {
    this.router.navigate(["umowy/" + school_id], {relativeTo: this.activeRoute});
  }

  get_latest_fruitVeg_product(contract: Contract){
       if (contract.annex.length === 0)
         return contract.fruitVeg_products;
       return contract.annex[0].fruitVeg_products;
  }

  get_latest_diary_product(contract:Contract) {
    if (contract.annex.length === 0)
      return contract.dairy_products;
    return contract.annex[0].dairy_products;
  }


}
