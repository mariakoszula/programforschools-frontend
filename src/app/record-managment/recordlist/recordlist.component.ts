import {Component, OnDestroy, OnInit} from '@angular/core';
import {Record, RecordStates} from "../../record-planner/record.model";
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";
import {Subscription, switchMap} from "rxjs";
import {Contract} from "../../documents/contract.model";
import {ProductStore} from "../../programs/program.model";
import {ActivatedRoute, Router} from "@angular/router";
import * as RecordActions from "../../record-planner/store/record.action";

@Component({
  selector: 'app-recordlist',
  templateUrl: './recordlist.component.html'
})
export class RecordListComponent implements OnInit, OnDestroy {
  recordsDtOptions: DataTables.Settings = {};
  records: Record[] = [];
  contracts: Contract[] = [];
  product_storage: ProductStore[] = [];
  sub: Subscription | null = null;
  constructor(private store: Store<AppState>,
              private router: Router,
              private activeRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.sub = this.store.select("program").pipe(
      switchMap(programState => {
        this.product_storage = this.product_storage.concat(programState.fruitVegProducts).concat(programState.dairyProducts);
        return this.store.select("record");
      }),
      switchMap(recordState => {
        this.records = recordState.records;
        return this.store.select("document");
      })).subscribe(documentState => {
        this.contracts = documentState.contracts;
    });
  }

  get_school_name(record: Record) {
    return this.contracts.find(contract => contract.id === record.contract_id)!.school.nick;
  }

  get_product_name(record: Record) {
    return this.product_storage.find(product_store => product_store.id === record.product_store_id)!.product.name;
  }

  get_product_type(record: Record) {
      return this.product_storage.find(product_store => product_store.id === record.product_store_id)!.product.product_type;
  }

  isPlanned(record: Record) {
    return record.state == RecordStates.PLANNED;
  }

  isGenerated(record: Record) {
    return record.state == RecordStates.GENERATED;
  }

  onEditRecord(record: Record) {
    //TODO do we need onEdit method for records?
    this.router.navigate([record.id], {relativeTo: this.activeRoute});
  }

  onDeleteRecord(id: number) {
    this.store.dispatch(new RecordActions.DeleteRecord(id));
  }

  onConfirmDelivered(record: Record) {
    record.state = RecordStates.DELIVERED;
    this.store.dispatch(new RecordActions.UpdateRecord(record));
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }


}
