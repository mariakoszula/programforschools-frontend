import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";
import {Subscription} from "rxjs";
import {State} from "../../documents/store/documents.reducer";

export class QueuedTaskInfo {
  constructor(public id: string,
              public name: string,
              public progress: number) {
  }
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  notificationsToDisplay: { [key: string]: QueuedTaskInfo } = {};
  subscription: Subscription | null = null;

  constructor(private store: Store<{ document: State }>) {
  }

  getNotifications() {
    return Object.values(this.notificationsToDisplay).sort((n1, n2) => n1.progress - n2.progress);
  }

  ngOnInit(): void {
    this.subscription = this.store.select(state => (state as any).document).subscribe((documentState: State) => {
      if (documentState && documentState.queuedTasks) {
        Object.entries(documentState.queuedTasks.entities).forEach(
          ([key, value]: [string, any]) => {
            if (value) {
              if (this.notificationsToDisplay[key] === undefined) {
                this.notificationsToDisplay[key] = new QueuedTaskInfo(key, value.name, value.progress);
              } else {
                this.notificationsToDisplay[key].progress = value.progress;
              }
            }
          });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getProgressClass(progress: number): string {
    if (progress === -1) return 'progress-error';
    if (progress === 100) return 'progress-complete';
    if (progress > 0) return 'progress-active';
    return 'progress-pending';
  }

  getStatusText(progress: number): string {
    if (progress === -1) return 'Błąd';
    if (progress === 100) return 'Ukończono';
    if (progress > 0) return 'Przetwarzanie...';
    return 'Oczekiwanie...';
  }
}
