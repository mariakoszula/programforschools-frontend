import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import * as ProgramActions from "../../store/program.action";
import {Store} from "@ngrx/store";
import {AppState} from "../../../store/app.reducer";
import {
  convert_range_dates_and_validate,
} from "../../../shared/date_converter.utils";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-week-edit',
  templateUrl: './week-edit.component.html',
})
export class WeekEditComponent implements OnInit, OnDestroy {
  weekForm: FormGroup;
  error: string = "";
  programSub: Subscription | null = null;

  constructor(private store: Store<AppState>) {
    this.weekForm = new FormGroup({});
    this.weekForm.addControl('week_no', new FormControl("", [Validators.required, Validators.min(1), Validators.max(20)]));
    this.weekForm.addControl('start_date', new FormControl("", [Validators.required]));
    this.weekForm.addControl('end_date', new FormControl("", [Validators.required]));
  }

  ngOnDestroy(): void {
    if (this.programSub) this.programSub.unsubscribe();
  }

  ngOnInit(): void {
    this.programSub = this.store.select("program").subscribe(action => {
      if (action.error) {
        this.error = action.error;
      } else {
        this.error = "";
      }
    });
  }

  addWeek() {
    let formValues = this.weekForm.getRawValue();
    this.error = convert_range_dates_and_validate(formValues);
    if (this.error) return;
    this.store.dispatch(new ProgramActions.AddWeek(formValues));
  }


}
