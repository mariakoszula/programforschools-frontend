import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {School} from "../school.model";
import * as SchoolActions from "../store/schools.action";
import {Store} from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import {Subscription} from "rxjs";
import {State} from "../store/schools.reducer";

@Component({
  selector: 'app-schoolslist',
  templateUrl: './schoolslist.component.html',
})
export class SchoolslistComponent implements OnInit, OnDestroy {
  schools: School[] = [];
  schoolDtOptions: DataTables.Settings = {};
  schoolsSub: Subscription | null = null;

  constructor(private router: Router,
              private activeRoute: ActivatedRoute,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.schoolsSub = this.store.select("school").subscribe(
      (schoolState: State) => {
        this.schools = schoolState.schools;
      }
    );
    this.schoolDtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      responsive: true,
      language: {"url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Polish.json"},
      rowCallback: (row: Node, data: any[] | Object, index:number) => {
        $('td', row).off('click');
        $('td', row).on('click', () => {
          this.onEdit(this.schools[index]);
        });
        return row;
      }};
    };

  addSchool() {
    this.router.navigate(["nowa"], {relativeTo: this.activeRoute});
  }

  onEdit(school: School) {
    this.router.navigate([school.id + "/edycja"], {relativeTo: this.activeRoute});
  }

  ngOnDestroy(): void {
    if (this.schoolsSub) this.schoolsSub.unsubscribe();
  }
}
