import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Program} from "../program.model";
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";
import {Subscription} from "rxjs";
import * as ProgramActions from "../store/program.action";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-programlist',
  templateUrl: './programlist.component.html'
})
export class ProgramlistComponent implements OnInit, OnDestroy {
  selectedProgram: Program | null = null;
  programs: Program[] = [];
  isLoading: boolean = false;
  programSub: Subscription | null = null;
  programsForm: FormGroup;
  constructor(private router: Router, private activeRoute: ActivatedRoute, private store: Store<AppState>) {
    this.programsForm = new FormGroup({
                program_id: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.programSub = this.store.select("programs").subscribe(
      (programState) => {
        this.isLoading = programState.isLoading;
        this.programs = programState.programs;
        if (programState.indexOfSelectedProgram !== -1) {
          this.selectedProgram = programState.programs[programState.indexOfSelectedProgram]
        } else {
          this.selectedProgram = null;
        }
      }
    )
  }

  addProgram(): void {
    this.router.navigate(["nowy"], {relativeTo: this.activeRoute});
  }

  ngOnDestroy(): void {
    if (this.programSub) this.programSub.unsubscribe();
  }

  loadOtherProgram(): void {
    this.store.dispatch(new ProgramActions.Fetch());
  }

  showDetails(): void {
    if (this.selectedProgram){
      this.router.navigate([this.selectedProgram.id], {relativeTo: this.activeRoute});
    }
  }

  onSelectProgram() {
    this.store.dispatch(new ProgramActions.Select(this.programsForm.value["program_id"]));
  }
}
