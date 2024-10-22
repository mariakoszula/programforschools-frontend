import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-document-generation-info',
  templateUrl: './document-generation-info.component.html',
})
export class DocumentGenerationInfoComponent implements OnInit, OnDestroy {
  contractSub: Subscription | null = null;
  generatedDocuments: { [name: string]: string } = {};
  notification: string | null = null;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.contractSub = this.store.select("document").subscribe((documentsState) => {
      documentsState.generatedDocuments.forEach((document) => {
        console.log("Ostatnio wygenerowane");
        console.log(document);
        const res = document.split(": webViewLink:");
        this.generatedDocuments[res[0]] = res[1];
        }
      );
      if (documentsState.notifications !== "") {
        this.notification = documentsState.notifications;
      }
    });
  }
    ngOnDestroy() {
    if (this.contractSub) this.contractSub.unsubscribe();
  }

  anyGeneratedDocuments () {
    return Object.keys(this.generatedDocuments).length !== 0;
  }

  anyNotifications() {
    return this.notification !== null;
  }

}
