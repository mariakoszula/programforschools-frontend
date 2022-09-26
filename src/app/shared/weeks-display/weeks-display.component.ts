import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Week} from "../../programs/program.model";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.reducer";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-weeks-display',
  templateUrl: './weeks-display.component.html'
})
export class WeeksDisplayComponent implements OnInit, OnDestroy {
  @Input() title: string = "";
  @Output() selectedWeekEvent = new EventEmitter<Week>();
  weeks: Week[] = [];
  sub: Subscription | null = null;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit(): void {
     this.sub = this.store.select("program").subscribe(programState => {
       this.weeks = programState.weeks;
     })
  }

  selectWeek($event: any, id: number) {
    let clickedElement = $event.target;
    if (clickedElement.nodeName === "BUTTON") {
      let isCertainButtonAlreadyActive = clickedElement.parentElement.querySelector(".active");
      if (isCertainButtonAlreadyActive) {
        isCertainButtonAlreadyActive.classList.remove("active");
      }
      clickedElement.className += " active";
    }
    let foundWeek = this.weeks.find(week => week.id === id);
    if (foundWeek) {
      this.selectedWeekEvent.emit(foundWeek);
    }
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }
}
