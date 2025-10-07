import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.reducer";
import {Subscription} from "rxjs";
import * as DocumentsActions from "../store/documents.action";
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-register-gen',
  templateUrl: './register-gen.component.html',
})
export class RegisterGenComponent implements OnInit {
  isGenerating: boolean = false;
  contractSub: Subscription | null = null;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.contractSub = this.store.select("document").subscribe((contractState) => {
      this.isGenerating = contractState.isGenerating;
    });
  }

  onGenerateRegistry() {
    this.store.dispatch(new DocumentsActions.GenerateRegister());

  }

  onGenerateRecordsRegistry() {
    this.store.dispatch(new DocumentsActions.GenerateRecordsRegister());
  }

  ngOnDestroy() {
    if (this.contractSub) this.contractSub.unsubscribe();
  }
}
