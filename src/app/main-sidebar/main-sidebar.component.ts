import { Component, OnInit } from '@angular/core';
import {Role, RoleUtils} from '../shared/namemapping.utils';

@Component({
  selector: 'app-main-sidebar',
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.css']
})
export class MainSidebarComponent implements OnInit {
  appName = RoleUtils.getProgramTitle();
  userIcon = RoleUtils.getIconName();
  isLogin = false;
  constructor() { }

  ngOnInit(): void {
  }

}
