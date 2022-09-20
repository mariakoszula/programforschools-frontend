import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RecordDataService} from "../record-data.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.component.html'
})
export class SelectDateComponent implements OnInit, OnDestroy {
  dates: string[];
  sub: Subscription | null = null;

  constructor(private recordDataService: RecordDataService,
              private router: Router,
              private activeRoute: ActivatedRoute) {
    this.dates = this.recordDataService.getDates();
  }

  ngOnInit(): void {
    this.sub = this.recordDataService.datesChanged.subscribe(dates => {
      this.dates = dates;
    });

  }


  selectDate($event: any) {
    this.router.navigate([$event.target.value + "/wybierz-szkoly"], {relativeTo: this.activeRoute});
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }
}
