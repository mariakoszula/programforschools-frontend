import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Invoice, Supplier} from "../invoice.model";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import {ActivatedRoute, Params} from "@angular/router";
import {formatDate} from "@angular/common";
import {
  convert_date_from_backend_format,
  convert_date_to_backend_format,
} from "../../shared/date_converter.utils";
import * as InvoiceAction from "../store/invoice.action";
import {get_current_program} from "../../shared/common.functions";

@Component({
  selector: 'app-invoice-edit',
  templateUrl: './invoice-edit.component.html'
})
export class InvoiceEditComponent {
  form: FormGroup;
  id: number = -1;
  edit: Invoice | null | undefined = null;
  paramsSub: Subscription | null = null;
  editSub: Subscription | null = null;
  suppliers: Supplier[] = [];
  supplier: Supplier | null | undefined = null;

  constructor(private store: Store<fromApp.AppState>,
              private activeRoute: ActivatedRoute) {
    this.form = new FormGroup({});
  }

  ngOnInit(): void {
    this.paramsSub = this.activeRoute.params.subscribe(
      (params: Params) => {
        if (params["invoice_id"])
          this.id = +params["invoice_id"];
      });
    this.editSub = this.store.select("invoice").subscribe(state => {
      this.suppliers = state.suppliers;
      if (this.id !== -1) {
        this.edit = state.invoices.find((_item: Invoice, index) => {
          return _item.id === this.id;
        });
      } else {
        this.id = -1;
        this.edit = null;
      }
    });
    this.initForm();
  }

  private initForm() {
    let name = null;
    let date = null;
    if (this.edit) {
      name = this.edit.name;
      date = this.edit.date;
      this.supplier = this.suppliers.find((supplier: Supplier) => {
        return supplier.id === this.edit?.supplier_id
      });

    }
    if (date) date = formatDate(convert_date_from_backend_format(date), "yyyy-MM-dd", 'en');
    this.form.addControl("name", new FormControl(name, [Validators.required]));
    this.form.addControl("date", new FormControl(date, [Validators.required]));
    if (this.supplier) {
      this.form.addControl("supplierForm", new FormControl({value: this.supplier, disabled: true}, [Validators.required]));
    } else {
      this.form.addControl("supplierForm", new FormControl(null, [Validators.required]));
    }
  }

  onSubmit() {
    let formValues = this.form.getRawValue();
    formValues["date"] = convert_date_to_backend_format(formValues["date"]);
    if (!this.edit) {
       formValues["program_id"] = get_current_program().id;
      let found = this.suppliers.find((supplier: Supplier) => {
        return supplier.id === formValues["supplierForm"].id
      });
      if (!found) {
        console.log("Could not find supplier - should not ever happen");
        return;
      }
      formValues["supplier_id"] = found.id;
    }
    delete formValues["supplierForm"];
    if (!this.edit) {
      this.store.dispatch(new InvoiceAction.AddInvoice(formValues));
    } else {
      this.store.dispatch(new InvoiceAction.UpdateInvoice(formValues, this.edit.id));
    }
  }

  ngOnDestroy(): void {
    if (this.paramsSub) this.paramsSub.unsubscribe();
    if (this.editSub) this.editSub.unsubscribe();
  }
}
