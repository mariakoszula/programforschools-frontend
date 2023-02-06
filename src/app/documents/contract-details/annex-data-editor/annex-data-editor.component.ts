import {Component, OnDestroy, OnInit} from '@angular/core';
import {Annex} from "../../contract.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Subscription, switchMap} from "rxjs";
import {convert_date_from_backend_format, convert_range_dates_and_validate} from "../../../shared/date_converter.utils";
import {Store} from "@ngrx/store";
import {AppState} from "../../../store/app.reducer";
import {formatDate} from "@angular/common";
import * as DocumentsActions from "../../store/documents.action";
import {FRUIT_VEG_PRODUCT, DAIRY_PRODUCT} from "../../../shared/namemapping.utils";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-annex-data-editor',
  templateUrl: './annex-data-editor.component.html'
})
export class AnnexDataEditorComponent implements OnInit, OnDestroy {
  isGenerating: boolean = false;
  editAnnex: Annex | null = null;
  annexForm: FormGroup;
  school_id: number = -1;
  contract_id: number = -1;
  school_nick: string = "";
  annex_id: number = -1;
  sub: Subscription | null = null;
  documentSub: Subscription | null = null;
  error: string = "";
  FRUIT_VEG_PRODUCT: string;
  DAIRY_PRODUCT: string;


  constructor(private activeRoute: ActivatedRoute,
              private router: Router,
              private store: Store<AppState>) {
    this.annexForm = new FormGroup({});
    this.FRUIT_VEG_PRODUCT = FRUIT_VEG_PRODUCT;
    this.DAIRY_PRODUCT = DAIRY_PRODUCT;
  }

  initForm() {
    let validity_date = null;
    let fruitVeg_products = null;
    let dairy_products = null;
    let validity_date_end = null;
    if (this.editAnnex) {
      validity_date = this.editAnnex.validity_date;
      validity_date_end = this.editAnnex.validity_date_end;
      fruitVeg_products = this.editAnnex.fruitVeg_products;
      dairy_products = this.editAnnex.dairy_products;
      if (validity_date) validity_date = formatDate(convert_date_from_backend_format(validity_date), "yyyy-MM-dd", 'en');
      if (validity_date_end) validity_date_end = formatDate(convert_date_from_backend_format(validity_date_end), "yyyy-MM-dd", 'en');
      this.annexForm.patchValue({
        'validity_date': validity_date, 'fruitVeg_products': fruitVeg_products,
        'dairy_products': dairy_products
      });
      if (validity_date_end) {
        this.annexForm.patchValue({'validity_date_end': validity_date_end});
      }
    }
    this.annexForm.addControl('sign_date', new FormControl("", [Validators.required]));
    this.annexForm.addControl('validity_date', new FormControl(validity_date, [Validators.required]));
    this.annexForm.addControl('validity_date_end', new FormControl(validity_date_end));
    this.annexForm.addControl('fruitVeg_products', new FormControl(fruitVeg_products, [Validators.required, Validators.max(1000)]));
    this.annexForm.addControl('dairy_products', new FormControl(dairy_products, [Validators.required, Validators.max(1000)]));
  }

  ngOnInit(): void {
    this.sub = this.activeRoute.params.pipe(
      switchMap((params: Params) => {
        if (!params["school_id"] || !params["contract_id"]) {
          this.router.navigate([".."], {relativeTo: this.activeRoute});
        }
        this.school_id = +params["school_id"];
        this.contract_id = +params["contract_id"];
        if (params["annex_id"]) {
          this.annex_id = +params["annex_id"];
        }
        return this.store.select("document");
      })).subscribe((documentsState) => {
      this.isGenerating = documentsState.isGenerating;
      const contract = documentsState.contracts.find((contract) => {
        return contract.id === this.contract_id;
      })
      if (contract) {
        this.school_nick = contract.school.nick;
        if (this.annex_id !== -1) {
          const annex = contract.annex.find((annex) => {
            return annex.id === this.annex_id
          });
          if (annex) {
            this.editAnnex = annex;
          } else {
            this.editAnnex = null;
          }
          this.initForm();
        }
      }
    });
    this.initForm();
  }

  onSubmitAnnex() {
    let formValues = this.annexForm.getRawValue();
    this.error = convert_range_dates_and_validate(formValues, "sign_date", "validity_date", "validity_date_end");
    if (this.error) return;
    if (this.editAnnex) formValues["no"] = this.editAnnex.no
    formValues["contract_id"] = this.contract_id;
    this.store.dispatch(new DocumentsActions.UpdateAnnex(formValues));
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
    if (this.documentSub) this.documentSub.unsubscribe();
  }
}
