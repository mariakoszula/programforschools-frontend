import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Record, RecordStates} from "../../record-planner/record.model";
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";
import {Subject, Subscription, switchMap} from "rxjs";
import {Contract} from "../../documents/contract.model";
import {ProductStore} from "../../programs/program.model";
import {ActivatedRoute, Router} from "@angular/router";
import * as RecordActions from "../../record-planner/store/record.action";
import {DataTableDirective} from "angular-datatables";

@Component({
  selector: 'app-recordlist',
  templateUrl: './recordlist.component.html'
})
export class RecordListComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};

  @ViewChild(DataTableDirective)
  dtElement?: DataTableDirective;

  loading: boolean = false;
  records: Record[] = [];
  contracts: Contract[] = [];
  product_storage: ProductStore[] = [];
  sub: Subscription | null = null;

  constructor(private store: Store<AppState>,
              private router: Router,
              private activeRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      responsive: true,
      language: {"url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Polish.json"},
      stateSave: true
    };
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

  isDelivered(record: Record) {
    return record.state == RecordStates.DELIVERED;
  }

  onEditRecord(record: Record) {
    //TODO do we need onEdit method for records?
    this.router.navigate([record.id], {relativeTo: this.activeRoute});
  }

  onDeleteRecord(id: number) {
    this.store.dispatch(new RecordActions.DeleteRecord(id));
    window.location.reload();
  }

  onConfirmDelivered(record: Record) {
    let updated_record = {...record, state: RecordStates.DELIVERED};
    this.store.dispatch(new RecordActions.UpdateRecord(updated_record));
    window.location.reload();
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  redirectTo(uri:string){
   this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
   this.router.navigate([uri]));
}
  // rerender(): void {
  //   if (this.dtElement && this.dtElement?.dtInstance) {
  //     this.dtElement?.dtInstance.then((dtInstance: DataTables.Api) => {
  //       // Destroy the table first
  //       dtInstance.destroy();
  //       this.loading = true;
  //       this.loading = false;
  //       setTimeout(() => {
  //         this.dtTrigger.next(true);
  //       });
  //     });
  //
  //   }
  // }


}
