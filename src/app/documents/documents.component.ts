import {Component, OnInit} from "@angular/core";

@Component({
  selector: "documents-component",
  templateUrl: "./documents.component.html"
})

export class DocumentsComponent implements OnInit {
  isLoading: boolean = false;

  ngOnInit(): void {
  }

}
