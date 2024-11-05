import {AfterViewInit,  Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Record, RecordStates} from "../../record-planner/record.model";
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";
import {Subject, Subscription, switchMap} from "rxjs";
import {Contract} from "../../documents/contract.model";
import {ProductStore} from "../../programs/program.model";
import {ActivatedRoute, Router} from "@angular/router";
import * as RecordActions from "../../record-planner/store/record.action";
import {DataTableDirective} from "angular-datatables";
import { Config } from 'datatables.net-dt';
import 'datatables.net-responsive';
import {DAIRY_PRODUCT, FRUIT_VEG_PRODUCT} from "../../shared/namemapping.utils";

@Component({
  selector: 'app-recordlist',
  templateUrl: './recordlist.component.html'
})
export class RecordListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective | undefined;
  dtOptions:  Config = {};
  dtTrigger: Subject<Config> = new Subject();

  loading: boolean = false;
  records: Record[] = [];
  contracts: Contract[] = [];
  product_storage: ProductStore[] = [];
  sub: Subscription | null = null;

  constructor(private store: Store<AppState>,
              private router: Router,
              private activeRoute: ActivatedRoute) {

  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(this.dtOptions);
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      responsive: true,
      destroy: true,
      language: {url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/pl.json"},
      stateSave: true,
      stateDuration: -1
    }
    this.sub = this.store.select("program").pipe(
      switchMap(programState => {
        this.product_storage = this.product_storage.concat(programState.fruitVegProducts).concat(programState.dairyProducts);
        return this.store.select("record");
      }),
      switchMap(recordState => {
        this.records = recordState.records;
        this.rerender();
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
    const type =  this.product_storage.find(product_store => product_store.id === record.product_store_id)!.product.product_type;
    if (type === DAIRY_PRODUCT) {
      return DAIRY_PRODUCT;
    }
    return FRUIT_VEG_PRODUCT;
  }

  isPlanned(record: Record) {
    return record.state == RecordStates.PLANNED;
  }

  isGenerated(record: Record) {
    return record.state == RecordStates.GENERATED;
  }

  isAssignNumber(record: Record) {
    return record.state == RecordStates.ASSIGN_NUMBER;
  }

  isDelivered(record: Record) {
    return record.state == RecordStates.DELIVERED;
  }

  isDeliveredPlanned(record: Record) {
    return record.state == RecordStates.DELIVERY_PLANNED;
  }

  onEditRecord(record: Record) {
    this.router.navigate([record.id], {relativeTo: this.activeRoute});
  }

  onConfirmDelivered(record: Record) {
    let updated_record = {...record, state: RecordStates.DELIVERED};
    this.store.dispatch(new RecordActions.UpdateRecord(updated_record));
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate([uri]));
  }

  onDeleteRecord(record: Record) {
    let school = this.get_school_name(record);
    let product = this.get_product_name(record);
    if (confirm("Czy usunąć WZ <" + record.date + ": " + product + "> dla " + school +"?")){
        this.store.dispatch(new RecordActions.DeleteRecord(record.id));
    }
  }


  rerender(): void {
     if (this.dtElement) {
       //TODO fix if needed
      this.dtElement.dtInstance.then(dtInstance => {
        // Destroy the table first
        // dtInstance.destroy();

        // Call the dtTrigger to rerender again
        // this.dtTrigger.next(this.dtOptions);
      });
    }
  }
}
