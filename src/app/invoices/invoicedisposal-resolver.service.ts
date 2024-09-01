import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {AppState} from "../store/app.reducer";
import {Store} from "@ngrx/store";
import {Observable, of, switchMap} from "rxjs";
import {map, take} from "rxjs/operators";
import {Actions, ofType} from "@ngrx/effects";
import {Injectable} from "@angular/core";
import {InvoiceDisposal} from "./invoice.model";
import * as InvoiceAction from "./store/invoice.action";
@Injectable({
  providedIn: 'root'
})
export class InvoiceDisposalResolverService implements Resolve<InvoiceDisposal[]> {

  constructor(private store: Store<AppState>,
              private actions$: Actions) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<InvoiceDisposal[]> | Promise<InvoiceDisposal[]> | InvoiceDisposal[] {
    return this.store.select("invoice").pipe(
      take(1),
      map(invoiceState => {
        return invoiceState.invoiceDisposal;
      }),
      switchMap(invoicesDisp => {
        if (invoicesDisp.length === 0) {
          this.store.dispatch(new InvoiceAction.FetchInvoiceDisposal());
          return this.actions$.pipe(
            ofType(InvoiceAction.SET_INVOICE_DISPOSALS),
            take(1)
          )
        } else {
          return of(invoicesDisp);
        }
      })
    );
  }
}
