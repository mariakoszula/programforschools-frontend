import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {Supplier} from "../invoice.model";
import {Store} from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import {ActivatedRoute, Params} from "@angular/router";
import * as InvoiceAction from "../store/invoice.action";
import {AddSupplier, UpdateSupplier} from "../store/invoice.action";

@Component({
  selector: 'app-supplier-edit',
  templateUrl: './supplier-edit.component.html'
})
export class SupplierEditComponent implements OnInit, OnDestroy {
  form: FormGroup;
  id: number = -1;
  edit: Supplier | null | undefined = null;
  paramsSub: Subscription | null = null;
  editSub: Subscription | null = null;

  constructor(private store: Store<fromApp.AppState>,
              private activeRoute: ActivatedRoute) {
    this.form = new FormGroup({});
  }

  ngOnInit(): void {
    this.paramsSub = this.activeRoute.params.subscribe(
      (params: Params) => {
        if (params["supplier_id"])
          this.id = +params["supplier_id"];
      });
    this.editSub = this.store.select("invoice").subscribe(state => {
      if (this.id !== -1) {
        this.edit = state.suppliers.find((_item: Supplier, index) => {
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
    let nick = null;
    let name = null;
    if (this.edit) {
      nick = this.edit.nick;
      name = this.edit.name;
      this.form.addControl("nick", new FormControl({
        value: nick, disabled: true
      }, []));

    }
    this.form.addControl("nick", new FormControl(nick, [Validators.required]));
    this.form.addControl("name", new FormControl(name, []));
  }

  onSubmit() {
    let formValues = this.form.getRawValue();
    if (!this.edit) {
      this.store.dispatch(new InvoiceAction.AddSupplier(formValues));
    } else {
      this.store.dispatch(new InvoiceAction.UpdateSupplier(formValues, this.edit.id));
    }
  }

  ngOnDestroy(): void {
    if (this.paramsSub) this.paramsSub.unsubscribe();
    if (this.editSub) this.editSub.unsubscribe();
  }
}
