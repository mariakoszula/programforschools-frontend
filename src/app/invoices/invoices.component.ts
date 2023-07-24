import {Component, OnInit} from "@angular/core";

@Component({
  selector: "invoices-component",
  templateUrl: "./invoices.component.html"
})

export class InvoicesComponent implements OnInit {
  isLoading: boolean = false;

  ngOnInit(): void {
  }

}
