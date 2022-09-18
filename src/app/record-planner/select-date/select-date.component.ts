import {Component, OnInit} from '@angular/core';
import {Week} from "../../programs/program.model";
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {map} from "rxjs/operators";
import {switchMap} from "rxjs";
import {
  convert_date_from_backend_format,
  get_next_date,
  is_working_day,
  validate_date
} from "../../shared/date_converter.utils";

@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.component.html'
})
export class SelectDateComponent implements OnInit {
  week: Week | null = null;
  week_id: number = -1;

  get dates(): string[] {
    let generated_dates: string[] = [];
    if (this.week) {
      let next_date = convert_date_from_backend_format(this.week.start_date);
      let end_date = convert_date_from_backend_format(this.week.end_date);
      while (validate_date(next_date, end_date)) {
        if (is_working_day(next_date)) {
          generated_dates.push(next_date);
        }
        next_date = get_next_date(next_date);
      }
    }
    return generated_dates;
  }

  constructor(private store: Store<AppState>,
              private router: Router,
              private activeRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activeRoute.params.pipe(
      map((param: Params) => {
        return +param["id"];
      }),
      switchMap(week_id => {
        this.week_id = week_id;
        return this.store.select("program");
      })
    ).subscribe(programState => {
      let foundWeek = programState.weeks.find(week => {
        return week.id === this.week_id
      });
      if (foundWeek) {
        this.week = foundWeek;
      } else {
        this.week_id = -1;
      }
    })
  }


  selectDate($event: any) {
    this.router.navigate([$event.target.value + "/wybierz-szkoly"], {relativeTo: this.activeRoute});
  }
}
