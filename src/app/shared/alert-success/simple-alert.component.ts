import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-alert-simple',
  templateUrl: './simple-alert.component.html',
  styleUrls: ['./simple-alert.component.css']
})
export class SimpleAlertComponent implements OnInit {
  @Input() messageHead: string;
  @Input() messageBody: string;
  @Input() alertType: string;
  @Output() close = new EventEmitter<void>();

  constructor() {
    this.messageHead = "";
    this.messageBody = "";
    this.alertType = "alert-success";
  }

  ngOnInit(): void {
  }

}
