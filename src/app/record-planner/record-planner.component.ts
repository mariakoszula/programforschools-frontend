import {Component, OnDestroy, OnInit} from '@angular/core';
import {Week} from "../programs/program.model";
import {AppState} from "../store/app.reducer";
import {Store} from "@ngrx/store";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-record-planner',
  templateUrl: './record-planner.component.html'
})
export class RecordPlannerComponent implements OnInit, OnDestroy {
  weeks: Week[] = [];
  programSub: Subscription | null = null;
  weekSelected: boolean = false;

  constructor(private store: Store<AppState>,
              private router: Router, private activeRoute: ActivatedRoute) {
  }

  ngOnDestroy(): void {
    if (this.programSub) this.programSub.unsubscribe();
  }

  ngOnInit(): void {
    this.programSub = this.store.select("program").subscribe(programState => {
      this.weeks = programState.weeks;
    });
  }

  selectWeek($event: any, id: number) {
    let clickedElement = $event.target;
    if( clickedElement.nodeName === "BUTTON" ) {
      let isCertainButtonAlreadyActive = clickedElement.parentElement.querySelector(".active");
      if( isCertainButtonAlreadyActive ) {
        isCertainButtonAlreadyActive.classList.remove("active");
      }
      clickedElement.className += " active";
    }
    this.weekSelected = true;
    this.router.navigate([id], {relativeTo: this.activeRoute});
  }
}
