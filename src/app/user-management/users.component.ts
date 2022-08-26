import {Component, DoCheck, OnChanges, OnDestroy, OnInit, SimpleChanges} from "@angular/core";
import {User} from "../auth/user.model";
import {AuthService} from "../auth/auth.service";
import {RoleUtils} from "../shared/namemapping.utils";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-users',
  templateUrl: 'users.component.html'

})

export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  public current_user!: User;
  private userSubscription: Subscription | undefined;
  userInfo: string = "";
  get isAdmin() {
    return RoleUtils.isAdmin(this.current_user);
  }

  constructor(private authService: AuthService, private router: Router,
              private activeRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe(user => {
      if (user) {
        this.current_user = user;
      }
    });
    this.users = this.authService.users(this.current_user.id);
  }


  addUser(): void {
    this.router.navigate(["nowy"], {relativeTo: this.activeRoute});
  }

  ngOnDestroy() {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

  onUserChange(info: string){
    this.userInfo = info;
    this.users = this.authService.users(this.current_user.id);
  }

}
