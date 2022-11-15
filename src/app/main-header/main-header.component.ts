import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
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
  displayNotification = false;
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
      this.isProgramSelected = programState.indexOfSelectedProgram !== -1;
    });
  }

  fetchData() {
    this.store.dispatch(new ProgramActions.Fetch());
    this.router.navigate(["/programy"]);
  }
  showNotifications(e: MouseEvent) {
    e.stopPropagation();
    this.displayNotification = !this.displayNotification;
  }

  @HostListener("document:click") hideOnClick() {
    this.displayNotification = false;
  }
}
