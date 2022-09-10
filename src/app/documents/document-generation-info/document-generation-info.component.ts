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

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.contractSub = this.store.select("document").subscribe((contractState) => {
      contractState.generatedDocuments.forEach((document) => {
        const res = document.split(": webViewLink:");
        this.generatedDocuments[res[0]] = res[1];
        }
      )
    });
  }
    ngOnDestroy() {
    if (this.contractSub) this.contractSub.unsubscribe();
  }

  anyGeneratedDocuments () {
    return Object.keys(this.generatedDocuments).length !== 0;
  }

}
