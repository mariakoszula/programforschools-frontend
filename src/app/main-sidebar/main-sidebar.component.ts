import {Component, OnInit} from '@angular/core';
import {Role, RoleUtils} from '../shared/namemapping.utils';
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-main-sidebar',
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.css']
})
export class MainSidebarComponent implements OnInit {
  appName = RoleUtils.getProgramTitle();
  userIcon = RoleUtils.getIconName();
  userName: string = '';
  isLoggedIn = false;
  private userSubscription: Subscription | undefined;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe(user => {
      this.isLoggedIn = !!user;
      if (user) {
        this.appName = RoleUtils.getProgramTitle(user.role);
        this.userIcon = RoleUtils.getIconName(user.role);
        this.userName = user.username;
      }else {
        this.appName = RoleUtils.getProgramTitle();
        this.userIcon = RoleUtils.getIconName();
        this.userName = "";
      }
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }
}
