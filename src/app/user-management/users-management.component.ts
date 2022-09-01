import {Component, OnInit} from "@angular/core";
import {User} from "../auth/user.model";
import {AuthService} from "../auth/auth.service";
import {RoleUtils} from "../shared/namemapping.utils";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-users-management',
  template: '<router-outlet></router-outlet>',
})

export class UsersManagementComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }
}
