import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-control-sidebar',
  templateUrl: './control-sidebar.component.html',
  styleUrls: ['./control-sidebar.component.css']
})
export class ControlSidebarComponent implements OnInit {
  currentProgram = "Program nr 1";
  isLogin = false;
  constructor() { }

  ngOnInit(): void {
  }

}
