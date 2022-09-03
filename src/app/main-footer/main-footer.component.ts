import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {AuthService} from "../auth/auth.service";
import {Store} from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import {map} from "rxjs/operators";
import * as AuthActions from "../auth/store/auth.actions"
import * as CompanyActions from "../companies/store/company.action";
import {Company} from "../companies/company.model";

@Component({
  selector: 'app-main-footer',
  templateUrl: './main-footer.component.html',
})
export class MainFooterComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  loggedInPerson = '';
  private userSubscription: Subscription | undefined;
  private companySub!: Subscription;
  company: Company | undefined;

  constructor(private authService: AuthService, private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.store.dispatch(new CompanyActions.Fetch());
    this.userSubscription = this.store.select('auth').pipe(map(authState => authState.user)).subscribe(user => {
      this.isLoggedIn = !!user;
      if (user)
        this.loggedInPerson = user.username;
    });
    this.companySub = this.store.select('company').pipe(map(companyState => companyState.company)).subscribe(company => {
      if (company)
        this.company = company;
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) this.userSubscription.unsubscribe();
    if (this.companySub) this.companySub.unsubscribe();
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }

}
