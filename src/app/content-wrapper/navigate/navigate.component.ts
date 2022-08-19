import { Component, OnInit } from '@angular/core';
import {NavigateService} from "./navigate.service";


@Component({
  selector: 'app-navigate',
  templateUrl: './navigate.component.html',
  styleUrls: ['./navigate.component.css']
})
export class NavigateComponent implements OnInit {

  constructor(public navHistoryService: NavigateService) { }
  ngOnInit(): void {
    this.navHistoryService.saveHistory();
  }

}
