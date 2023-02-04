import {Component, OnInit} from '@angular/core';
import {RoleUtils} from '../shared/namemapping.utils';
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-main-sidebar',
  templateUrl: './main-sidebar.component.html',
})
export class MainSidebarComponent implements OnInit {
  appName = RoleUtils.getProgramTitle();
  userIcon = RoleUtils.getIconName();
  userName: string = '';
  isLoggedIn = false;
  isProgramSelected = false;
  private userSubscription: Subscription | undefined;
  private programSub: Subscription | undefined;
  constructor(private store: Store<fromApp.AppState>, private router: Router) {
  }

  ngOnInit(): void {
    this.userSubscription = this.store.select('auth').pipe(map(authState => {
      return authState.user;
    })).subscribe(user => {
      this.isLoggedIn = !!user;
      if (user) {
        this.appName = RoleUtils.getProgramTitle(user.role);
        this.userIcon = RoleUtils.getIconName(user.role);
        this.userName = user.username;
      } else {
        this.appName = RoleUtils.getProgramTitle();
        this.userIcon = RoleUtils.getIconName();
        this.userName = "";
      }
    });
    this.programSub = this.store.select('program').subscribe(programState => {
      if (programState.indexOfSelectedProgram !== -1){
        this.isProgramSelected = true
      } else {
        this.isProgramSelected = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }
}
