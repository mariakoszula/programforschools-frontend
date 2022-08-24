import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {AuthService} from "../auth/auth.service";

@Component({
  selector: 'app-main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.css']
})
export class MainFooterComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  loggedInPerson = '';
  private userSubscription: Subscription | undefined;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe(user => {
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
    this.authService.logout();
  }

}
