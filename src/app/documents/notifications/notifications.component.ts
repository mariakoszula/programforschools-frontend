import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";

export class QueuedTaskInfo {
  constructor(public id: string,
              public name: string,
              public progress: number) {
  }
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notificationsToDisplay: { [key: string]: QueuedTaskInfo } = {};

  constructor(private store: Store<AppState>) {
  }

  getNotifications() {
    return Object.values(this.notificationsToDisplay).sort((n1, n2) => n1.progress - n2.progress);
  }

  ngOnInit(): void {
    this.store.select("document").subscribe(documentState => {
      console.log(documentState.queuedTasks.entities);
      Object.entries(documentState.queuedTasks.entities).forEach(
        ([key, value]) => {
          if (value) {
            if (this.notificationsToDisplay[key] === undefined) {
              this.notificationsToDisplay[key] = new QueuedTaskInfo(key, value.name, value.progress);
            } else {
              this.notificationsToDisplay[key].progress = value.progress;
            }
          }
        });
    })
  }

  ngOnDestroy(): void {
  }

}
