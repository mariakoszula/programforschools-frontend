import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import {Subscription} from "rxjs";
import {State} from "./store/schools.reducer";

@Component({
  selector: 'app-schools',
  templateUrl: './schools.component.html',
})
export class SchoolsComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  schoolsSub: Subscription | null = null;

  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.schoolsSub = this.store.select("school").subscribe(
      (schoolState: State) => {
        this.isLoading = schoolState.isLoading;
      }
    )
  }

  ngOnDestroy(): void {
    if (this.schoolsSub) this.schoolsSub.unsubscribe();
  }
}
