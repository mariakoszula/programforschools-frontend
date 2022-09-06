import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {School} from "../school.model";

@Component({
  selector: 'app-schoolslist',
  templateUrl: './schoolslist.component.html',
})
export class SchoolslistComponent implements OnInit {
  schools: School[] = [];
  schoolDtOptions: DataTables.Settings = {};

  constructor(private router: Router,
              private activeRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.schoolDtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      responsive: true,
      language: {"url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Polish.json"}
    };
  }

  addSchool() {
    this.router.navigate(["nowa"], {relativeTo: this.activeRoute});
  }

  onEdit() {
    //navigate to :id/edycja
  }
}
