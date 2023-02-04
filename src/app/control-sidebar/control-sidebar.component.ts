import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription, switchMap} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import {Program} from "../programs/program.model";
import {DayColors} from '../shared/namemapping.utils'

@Component({
  selector: 'app-control-sidebar',
  templateUrl: './control-sidebar.component.html'
})
export class ControlSidebarComponent implements OnInit, OnDestroy {
  program: Program | null = null;
  isLoggedIn = false;
  days = [
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek"
  ] as const;
  private userSubscription: Subscription | undefined;

  constructor(private store: Store<fromApp.AppState>) {

  }

  ngOnInit(): void {
    this.userSubscription = this.store.select('auth').pipe(
      switchMap(authState => {
        this.isLoggedIn = !!authState.user;
        return this.store.select('program');
      })).subscribe(programState => {
        let isProgramSelected = programState.indexOfSelectedProgram !== -1;
        if (isProgramSelected){
          this.program = programState.programs[programState.indexOfSelectedProgram];
        }
      });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }
  getDayColor(i: number){
    return DayColors[i];
  }
}
