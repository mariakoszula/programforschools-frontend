import { Component, OnInit } from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-school-data-editor',
  templateUrl: './school-data-editor.component.html',
})
export class SchoolDataEditorComponent implements OnInit {
  schoolForm: FormGroup;

  constructor() {
    this.schoolForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {

  }
}
