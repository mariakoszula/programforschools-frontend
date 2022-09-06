import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-schools',
  templateUrl: './schools.component.html',
})
export class SchoolsComponent implements OnInit {
  isLoading: boolean = false;
  id: number = -1;

  constructor() {
  }

  ngOnInit(): void {
  }

}
