import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {AppState} from "../store/app.reducer";
import {Store} from "@ngrx/store";
import {Observable, of, switchMap} from "rxjs";
import {map, take} from "rxjs/operators";
import {Actions, ofType} from "@ngrx/effects";
import {Injectable} from "@angular/core";
import { InvoiceProduct} from "./invoice.model";
import * as InvoiceAction from "./store/invoice.action";
@Injectable({
  providedIn: 'root'
})
export class InvoiceProductResolverService implements Resolve<InvoiceProduct[]> {

  constructor(private store: Store<AppState>,
              private actions$: Actions) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<InvoiceProduct[]> | Promise<InvoiceProduct[]> | InvoiceProduct[] {
    return this.store.select("invoice").pipe(
      take(1),
      map(invoiceState => {
        return invoiceState.invoicesProduct;
      }),
      switchMap(invoices => {
        if (invoices.length === 0) {
          this.store.dispatch(new InvoiceAction.FetchInvoiceProducts());
          return this.actions$.pipe(
            ofType(InvoiceAction.SET_INVOICE_PRODUCTS),
            take(1)
          )
        } else {
          return of(invoices);
        }
      })
    );
  }
}
