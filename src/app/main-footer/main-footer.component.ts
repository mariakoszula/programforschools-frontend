import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {AuthService} from "../auth/auth.service";
import {Store} from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import {map} from "rxjs/operators";
import * as AuthActions from  "../auth/store/auth.actions"

@Component({
  selector: 'app-main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.css']
})
export class MainFooterComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  loggedInPerson = '';
  private userSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.userSubscription = this.store.select('auth').pipe(map(authState => authState.user)).subscribe(user => {
      this.isLoggedIn = !!user;
      if (user)
        this.loggedInPerson = user.username;
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

  onLogout()
  {
    this.store.dispatch(new AuthActions.Logout());
  }

}
