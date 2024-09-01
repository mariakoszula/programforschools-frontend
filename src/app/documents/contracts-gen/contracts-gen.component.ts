import {Component, OnDestroy, OnInit} from '@angular/core';
import {School} from "../../schools/school.model";
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";
import {Program} from "../../programs/program.model";
import {AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import * as DocumentsActions from "../store/documents.action";

@Component({
  selector: 'app-contracts-gen',
  templateUrl: './contracts-gen.component.html'
})
export class ContractsGenComponent implements OnInit, OnDestroy {
  public schools: School[] = [];
  program: Program | null = null;
  contractForm: FormGroup;
  programSub: Subscription | null = null;
  contractSub: Subscription | null = null;
  schoolSub: Subscription | null = null;
  isGenerating: boolean = false;
  get schoolsControls() {
    return (this.contractForm.get("schools") as FormArray).controls;
  }

  constructor(private store: Store<AppState>) {
    this.contractForm = new FormGroup<any>({
      'select_all': new FormControl("", []),
      'contract_date': new FormControl("", [Validators.required]),
      'schools': new FormArray([], atLeastOneCheckboxSelectedValidator()),
    });
  }


  ngOnInit(): void {
    this.programSub = this.store.select("program").subscribe((programState) => {
      this.program = programState.programs[programState.indexOfSelectedProgram];
    })
    this.schoolSub = this.store.select("school").subscribe((schoolState) => {
      this.schools = schoolState.schools;
      this.schools.forEach((school) => {
          (<FormArray>this.contractForm.get("schools")).push(new FormControl(false));
        }
      )
    });
    this.contractSub = this.store.select("document").subscribe((contractState) => {
      this.isGenerating = contractState.isGenerating;
    });
  }

  onContractCreate() {
    const selectedSchoolIds = this.contractForm.value.schools.map((checked: boolean, index: number) => {
      return checked ? this.schools[index].id : null;
    }).filter((res: number | null) => res !== null);
    this.store.dispatch(new DocumentsActions.GenerateContracts({
      school_ids: selectedSchoolIds,
      contract_date: this.contractForm.value.contract_date
    }));
  }

  ngOnDestroy() {
    if (this.programSub) this.programSub.unsubscribe();
    if (this.schoolSub) this.schoolSub.unsubscribe();
    if (this.contractSub) this.contractSub.unsubscribe();
  }

  checkUncheck() {
    this.schoolsControls.forEach(control => {
      control.setValue(this.contractForm.value.select_all);
    });
  }

}

function atLeastOneCheckboxSelectedValidator(): ValidatorFn {
  return (formArray: AbstractControl): { [key: string]: boolean } | null => {
    const selectedCheckbox = formArray.value.some((isChecked: boolean) => isChecked);
    return selectedCheckbox ? null : { 'atLeastOneCheckboxSelected': true };
  };
}

