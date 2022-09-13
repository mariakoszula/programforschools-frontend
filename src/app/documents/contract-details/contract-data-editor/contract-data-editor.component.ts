import {Component, OnDestroy, OnInit} from '@angular/core';
import {Contract} from "../../contract.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Params} from "@angular/router";
import {Subscription} from "rxjs";
import {AppState} from "../../../store/app.reducer";
import {Store} from "@ngrx/store";
import * as DocumentsActions from "../../store/documents.action";

@Component({
  selector: 'app-contract-data-editor',
  templateUrl: './contract-data-editor.component.html',
})
export class ContractDataEditorComponent implements OnInit, OnDestroy {
  contract: Contract | null = null;
  contractForm: FormGroup;
  paramsSub: Subscription | null = null;
  documentSub: Subscription | null = null;

  contract_id: number = -1;

  constructor(private activeRoute: ActivatedRoute,
              private store: Store<AppState>) {
    this.contractForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.paramsSub = this.activeRoute.params.subscribe(
      (params: Params) => {
        if (params["contract_id"]) {
          this.contract_id = +params["contract_id"];
          this.documentSub = this.store.select("document").subscribe(documentsState => {
            const contract = documentsState.contracts.find((contract) => {
              return contract.id === this.contract_id;
            })
            if (contract) {
              this.contract = contract;
            } else {
              this.contract = null;
              this.contract_id = -1;
            }
          });

        }
      });
    if (this.contract) {
      this.contractForm.addControl('fruitVeg_products', new FormControl(this.contract.fruitVeg_products, [Validators.required, Validators.max(1000)]));
      this.contractForm.addControl('dairy_products', new FormControl(this.contract.dairy_products, [Validators.required, Validators.max(1000)]));
    }
  }

  onSubmitKidsNoUpdate() {
    let formValues = this.contractForm.getRawValue();
    if (this.contract){
      this.store.dispatch(new DocumentsActions.UpdateKidsNo(formValues, this.contract.school.id));
    }
  }

  ngOnDestroy(): void {
    if (this.paramsSub) this.paramsSub.unsubscribe();
    if (this.documentSub) this.documentSub.unsubscribe();
  }

}
