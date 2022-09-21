import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';


const iconMapping: {[key: string]: string} = {
  'alert-success': 'fa-check',
  'alert-warning': 'fa-exclamation-triangle'
}
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

  icon: string = "fa-check";
  constructor() {
    this.messageHead = "";
    this.messageBody = "";
    this.alertType = "alert-success";
  }

  ngOnInit(): void {
    this.icon = iconMapping[this.alertType];
  }

}
