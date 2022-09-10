import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import * as ProgramActions from "../../store/program.action";
import {Store} from "@ngrx/store";
import {AppState} from "../../../store/app.reducer";
import {
  convert_range_dates_and_validate,
} from "../../../shared/date_converter.utils";

@Component({
  selector: 'app-week-edit',
  templateUrl: './week-edit.component.html',
})
export class WeekEditComponent implements OnInit {
  weekForm: FormGroup;
  error: string = "";

  constructor(private store: Store<AppState>) {
    this.weekForm = new FormGroup({});
    this.weekForm.addControl('week_no', new FormControl("", [Validators.required, Validators.min(1), Validators.max(20)]));
    this.weekForm.addControl('start_date', new FormControl("", [Validators.required]));
    this.weekForm.addControl('end_date', new FormControl("", [Validators.required]));
  }

  ngOnInit(): void {
  }

  addWeek() {
    let formValues = this.weekForm.getRawValue();
    this.error = convert_range_dates_and_validate(formValues);
    if (this.error) return;
    this.store.dispatch(new ProgramActions.AddWeek(formValues));
  }


}
