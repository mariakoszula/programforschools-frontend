import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {AppState} from "../store/app.reducer";
import {Store} from "@ngrx/store";
import {Observable, of, switchMap} from "rxjs";
import {map, take} from "rxjs/operators";
import {Actions, ofType} from "@ngrx/effects";
import {Injectable} from "@angular/core";
import {Invoice} from "./invoice.model";
import * as InvoiceAction from "./store/invoice.action";
@Injectable({
  providedIn: 'root'
})
export class InvoiceResolverService implements Resolve<Invoice[]> {

  constructor(private store: Store<AppState>,
              private actions$: Actions) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Invoice[]> | Promise<Invoice[]> | Invoice[] {
    return this.store.select("invoice").pipe(
      take(1),
      map(invoiceState => {
        return invoiceState.invoices;
      }),
      switchMap(invoices => {
        if (invoices.length === 0) {
          this.store.dispatch(new InvoiceAction.FetchInvoice());
          return this.actions$.pipe(
            ofType(InvoiceAction.SET_INVOICES),
            take(1)
          )
        } else {
          return of(invoices);
        }
      })
    );
  }
}
