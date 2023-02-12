import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import * as ProgramActions from "../store/program.action";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.reducer";
import {
  convert_date_from_backend_format,
  convert_range_dates_and_validate,
} from "../../shared/date_converter.utils";
import {Subscription, switchMap} from "rxjs";
import {Week} from "../program.model";
import {formatDate} from "@angular/common";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-week-edit',
  templateUrl: './week-edit.component.html',
})
export class WeekEditComponent implements OnInit, OnDestroy {
  weekForm: FormGroup;
  error: string = "";
  programSub: Subscription | null = null;
  editWeek: Week | null = null;
  selected_week_id: number = -1;

  constructor(private store: Store<AppState>,
              private router: Router,
              private activeRoute: ActivatedRoute) {
    this.weekForm = new FormGroup({});
  }

  initForm(): void {
    let weekNo = null;
    let startDate = null;
    let endDate = null;
    let disabled = false;
    if (this.editWeek) {
      disabled = true;
      weekNo = this.editWeek.week_no;
      startDate = this.editWeek.start_date;
      endDate = this.editWeek.end_date;
    }
    if (startDate) startDate = formatDate(convert_date_from_backend_format(startDate), "yyyy-MM-dd", 'en');
    if (endDate) endDate = formatDate(convert_date_from_backend_format(endDate), "yyyy-MM-dd", 'en');

    this.weekForm.addControl('week_no', new FormControl({
      value: weekNo,
      disabled: disabled
    }, [Validators.required, Validators.min(1), Validators.max(20)]));
    this.weekForm.addControl('start_date', new FormControl(startDate, [Validators.required]));
    this.weekForm.addControl('end_date', new FormControl(endDate, [Validators.required]));

  }

  ngOnDestroy(): void {
    if (this.programSub) this.programSub.unsubscribe();
  }

  ngOnInit(): void {
    this.activeRoute.params.pipe(
      map((param: Params) => {
        if (param["week_id"])
          return +param["week_id"];
        return -1;
      }),
      switchMap(week_id => {
        this.selected_week_id = week_id;
        return this.store.select("program");
      })).subscribe(programState => {
      if (programState.error) {
        this.error = programState.error;
      }
      const foundWeek = programState.weeks.find((_week, index) => {
        return _week.id === this.selected_week_id;
      });
      if (foundWeek) {
        this.editWeek = foundWeek;
      } else {
        this.editWeek = null;
        this.selected_week_id = -1;
        this.weekForm.reset();
      }
      this.initForm();
    });
    this.error = "";
  }

  addOrEditWeek() {
    let formValues = this.weekForm.getRawValue();
    this.error = convert_range_dates_and_validate(formValues);
    if (this.error) return;
    if (this.editWeek) {
      let week = {...this.editWeek, ...formValues};
      this.store.dispatch(new ProgramActions.EditWeek({...week}));
    } else {
      this.store.dispatch(new ProgramActions.AddWeek(formValues));
    }
  }

  removeWeek() {
    if (confirm("Czy chesz usunąć tydzien: " + this.editWeek?.week_no)) {
      if (this.editWeek) {
        this.store.dispatch(new ProgramActions.DeleteWeek(this.editWeek?.id));
      }
    }
  }
}
