import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {Supplier} from "../invoice.model";
import {Store} from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import {ActivatedRoute, Params, Router} from "@angular/router";
import * as InvoiceAction from "../store/invoice.action";
import {State} from "../store/invoice.reducer";

@Component({
  selector: 'app-supplier-edit',
  templateUrl: './supplier-edit.component.html',
  styleUrls: ['./supplier-edit.component.css']
})
export class SupplierEditComponent implements OnInit, OnDestroy {
  form: FormGroup;
  id: number = -1;
  edit: Supplier | null | undefined = null;
  paramsSub: Subscription | null = null;
  editSub: Subscription | null = null;

  constructor(private store: Store,
              private activeRoute: ActivatedRoute,
              public router: Router) {  // ← CHANGED: public instead of private
    this.form = new FormGroup({});
  }

  ngOnInit(): void {
    this.paramsSub = this.activeRoute.params.subscribe(
      (params: Params) => {
        if (params["supplier_id"])
          this.id = +params["supplier_id"];
      });

    // ← FIXED: Type the store.select properly
    this.editSub = this.store.select(state => (state as any).invoice).subscribe((invoiceState: State) => {
      if (this.id !== -1) {
        this.edit = invoiceState.suppliers.find((_item: Supplier) => {  // ← FIXED: Removed unused index parameter
          return _item.id === this.id;
        });
      } else {
        this.id = -1;
        this.edit = null;
      }
      this.initForm();
    });
  }

  private initForm() {
    let nick = '';
    let name = '';
    let address = '';
    let contact = '';
    let nip = '';

    if (this.edit) {
      nick = this.edit.nick || '';
      name = this.edit.name || '';
      address = this.edit.address || '';
      contact = this.edit.contact || '';
      nip = this.edit.nip || '';
    }

    // Reset form controls first
    this.form.reset();

    // Create form with all fields
    this.form = new FormGroup({
      nick: new FormControl(nick, [Validators.required]),
      name: new FormControl(name, []),
      address: new FormControl(address, []),
      contact: new FormControl(contact, []),
      nip: new FormControl(nip, [])
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      console.log('Form is invalid');
      return;
    }

    let formValues = this.form.getRawValue();

    if (this.id === -1) {
      // Add new supplier
      this.store.dispatch(new InvoiceAction.AddSupplier(formValues));
    } else {
      // Update existing supplier
      this.store.dispatch(new InvoiceAction.UpdateSupplier(formValues, this.edit!.id));
    }

    // Navigate back to list
    this.router.navigate(['faktury/dostawcy']);
  }

  ngOnDestroy(): void {
    if (this.paramsSub) this.paramsSub.unsubscribe();
    if (this.editSub) this.editSub.unsubscribe();
  }
}
