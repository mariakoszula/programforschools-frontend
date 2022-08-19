import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})
export class MainHeaderComponent implements OnInit {
  menuItem1 = "menuItem1"; // TODO create custom menu based on role
  isLogin = false;
  constructor(public router: Router) { }

  ngOnInit(): void {
  }

}
