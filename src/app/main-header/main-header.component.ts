import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Subscription, switchMap} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import * as ProgramActions from '../programs/store/program.action';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
})
export class MainHeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isProgramSelected = false;
  private userSubscription: Subscription | undefined;

  constructor(private store: Store<fromApp.AppState>,
              public router: Router) {
  }

  ngOnDestroy(): void {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.userSubscription = this.store.select('auth').pipe(
      switchMap(authState => {
        this.isLoggedIn = !!authState.user;
        return this.store.select('program');
      })).subscribe(programState => {
      if (programState.indexOfSelectedProgram !== -1) {
        this.isProgramSelected = true
      } else {
        this.isProgramSelected = false;
      }
    });
  }

  fetchData() {
    this.store.dispatch(new ProgramActions.Fetch());
    this.router.navigate(["/programy"]);
  }
}
