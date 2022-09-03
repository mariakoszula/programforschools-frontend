import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import * as ProgramActions from "../store/program.action";

@Component({
  selector: 'app-program-add',
  templateUrl: './program-data-editor.component.html'
})
export class ProgramDataEditorComponent implements OnInit {
  programForm: FormGroup;
  error: string = "";
  isEditMode: boolean;
  isLoading: boolean;
  constructor(private store: Store<fromApp.AppState>) {
    this.isEditMode = false;
    this.isLoading = false;
    this.programForm = new FormGroup({
          semester_no: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(2)]),
          school_year: new FormControl(null, [Validators.required, Validators.pattern('20\\d\\d\\/20\\d\\d')]),
          start_date: new FormControl(null, []),
          end_date: new FormControl(null, []),
          fruitVeg_price: new FormControl(null, [Validators.max(3)]),
          dairy_price: new FormControl(null, [Validators.max(3)]),
          fruitVeg_min_per_week: new FormControl(null, [Validators.min(1), Validators.max(100)]),
          dairy_min_per_week: new FormControl(null, [Validators.min(1), Validators.max(100)]),
          dairy_amount: new FormControl(null, [Validators.min(1), Validators.max(100)]),
          fruitVeg_amount: new FormControl(null, [Validators.min(1), Validators.max(100)]),
    });
  }

  ngOnInit(): void {
    this.store.select("programs").subscribe( resp => {
      this.isLoading = resp.isLoading;
    });
  }

  onSubmitProgram(){
    if (!this.isEditMode) {
      this.store.dispatch(new ProgramActions.Add(this.programForm.getRawValue()));
    }

  }

}
