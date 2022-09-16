import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import {Program} from "../program.model";
import {Subscription} from "rxjs";
import {
  convert_date_from_backend_format,
  convert_range_dates_and_validate
} from "../../shared/date_converter.utils";
import * as ProgramActions from "../store/program.action";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-program-add',
  templateUrl: './program-data-editor.component.html'
})
export class ProgramDataEditorComponent implements OnInit, OnDestroy {
  programForm: FormGroup;
  error: string = "";
  isLoading: boolean;
  editedProgram: Program | null = null;
  programSub: Subscription | null = null;

  constructor(private store: Store<fromApp.AppState>) {
    this.isLoading = false;
    this.programForm = new FormGroup({});
  }

  ngOnDestroy(): void {
    if (this.programSub) this.programSub.unsubscribe();
  }

  ngOnInit(): void {
    this.programSub = this.store.select("program")
      .subscribe(programState => {
          this.isLoading = programState.isLoading;
          if (programState.indexOfSelectedProgram !== -1) {
            this.editedProgram = programState.programs[programState.indexOfSelectedProgram];
          } else {
            this.editedProgram = null;
          }
        }
      );
    this.initForm();
  }

  private initForm() {
    let semestrNo = null;
    let schoolYear = null;
    let startDate = null;
    let endDate = null;
    let fruitVegPrice = null;
    let fruitVegMinPerWeek = null;
    let fruitVegAmount = null;
    let dairyPrice = null;
    let dairyMinPerWeek = null;
    let dairyAmount = null;
    let isDisabled = false;
    if (this.editedProgram) {
      semestrNo = this.editedProgram.semester_no;
      schoolYear = this.editedProgram.school_year;
      startDate = this.editedProgram.start_date;
      endDate = this.editedProgram.end_date;
      fruitVegPrice = this.editedProgram.fruitVeg_price;
      fruitVegMinPerWeek = this.editedProgram.fruitVeg_min_per_week;
      fruitVegAmount = this.editedProgram.fruitVeg_amount;
      dairyPrice = this.editedProgram.dairy_price;
      dairyMinPerWeek = this.editedProgram.dairy_min_per_week;
      dairyAmount = this.editedProgram.dairy_amount;
      isDisabled = true;
    }
    this.programForm.addControl('semester_no', new FormControl({
      value: semestrNo,
      disabled: isDisabled
    }, [Validators.required, Validators.min(1), Validators.max(2)]));
    this.programForm.addControl('school_year', new FormControl({
      value: schoolYear,
      disabled: isDisabled
    }, [Validators.required, Validators.pattern('20\\d\\d\\/20\\d\\d')]));
    if (startDate) startDate = formatDate(convert_date_from_backend_format(startDate), "yyyy-MM-dd", 'en');
    if (endDate) endDate = formatDate(convert_date_from_backend_format(endDate), "yyyy-MM-dd", 'en');

    this.programForm.addControl('start_date', new FormControl(startDate, []));
    this.programForm.addControl('end_date', new FormControl(endDate, []));
    this.programForm.addControl('fruitVeg_price', new FormControl(fruitVegPrice, [Validators.max(3)]));
    this.programForm.addControl('fruitVeg_min_per_week', new FormControl(fruitVegMinPerWeek, [Validators.min(1), Validators.max(100)]));
    this.programForm.addControl('fruitVeg_amount', new FormControl(fruitVegAmount, [Validators.min(1), Validators.max(100)]));
    this.programForm.addControl('dairy_price', new FormControl(dairyPrice, [Validators.max(3)]));
    this.programForm.addControl('dairy_min_per_week', new FormControl(dairyMinPerWeek, [Validators.min(1), Validators.max(100)]));
    this.programForm.addControl('dairy_amount', new FormControl(dairyAmount, [Validators.min(1), Validators.max(100)]));
  }


  onSubmitProgram() {
    let formValues = this.programForm.getRawValue();
    this.error = convert_range_dates_and_validate(formValues);
    if (this.error) return;
    if (!this.editedProgram) {
      this.store.dispatch(new ProgramActions.Add(formValues));
    } else {
      this.store.dispatch(new ProgramActions.Update(formValues));
    }

  }
}
