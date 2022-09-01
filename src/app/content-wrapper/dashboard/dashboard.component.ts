import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  appName = environment.mainProgramName;
  isLoggedIn: boolean = false;
  private userSubscription: Subscription | undefined;

  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
      this.userSubscription = this.store.select('auth').pipe(map(authState => authState.user)).subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

}
