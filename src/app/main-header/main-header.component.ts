import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Subscription, switchMap} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import * as ProgramActions from '../programs/store/program.action';
import {ResetNotificationCounter} from "../documents/store/documents.action";

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
})
export class MainHeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isProgramSelected = false;
  displayNotification = false;
  newNotificationsCounter = 0;
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
      }),
      switchMap(programState => {
          this.isProgramSelected = programState.indexOfSelectedProgram !== -1;
          return this.store.select('document');
      })).subscribe(documentState => {
        this.newNotificationsCounter = documentState.notificationCounter;
    });
  }

  fetchData() {
    this.store.dispatch(new ProgramActions.Fetch());
  }
  showNotifications(e: MouseEvent) {
    e.stopPropagation();
    this.displayNotification = !this.displayNotification;
    this.newNotificationsCounter = 0;
    this.store.dispatch(new ResetNotificationCounter());
  }

  @HostListener("document:click") hideOnClick() {
    this.displayNotification = false;
  }
}
