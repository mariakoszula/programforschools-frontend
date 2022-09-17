import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import {map} from "rxjs/operators";
import * as ProgramActions from '../programs/store/program.action';
import { Program } from '../programs/program.model';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
})
export class MainHeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  private userSubscription: Subscription | undefined;

  constructor(private store: Store<fromApp.AppState>,
              public router: Router) {
  }

  ngOnDestroy(): void {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.userSubscription = this.store.select('auth').pipe(map(authState => {
      return authState.user;
    })).subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  fetchData() {
     this.store.dispatch(new ProgramActions.Fetch());
     this.router.navigate(["/programy"]);
  }
}
