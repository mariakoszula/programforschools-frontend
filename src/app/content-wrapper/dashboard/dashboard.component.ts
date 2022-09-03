import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import {map} from "rxjs/operators";
import * as CompanyActions from "../../companies/store/company.action";
import {Company} from "../../companies/company.model";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  appName = environment.mainProgramName;
  isLoggedIn: boolean = false;
  private userSubscription: Subscription | undefined;
  private companySub!: Subscription;
  company: Company | undefined;

  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.userSubscription = this.store.select('auth').pipe(map(authState => authState.user)).subscribe(user => {
      this.isLoggedIn = !!user;
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

}
