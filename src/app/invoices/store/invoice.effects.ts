import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {AppState} from "src/app/store/app.reducer";
import {Store} from "@ngrx/store";
import {catchError, of, switchMap} from "rxjs";
import {environment} from "../../../environments/environment";
import {Invoice, InvoiceProduct, Supplier} from "../invoice.model";
import * as InvoiceAction from "./invoice.action";
import {map} from "rxjs/operators";
import {get_current_program} from "../../shared/common.functions";

@Injectable()
export class InvoiceEffects {
  fetchInvoices$ = createEffect(() => {
    return this.action$.pipe(
      ofType(InvoiceAction.FETCH_INVOICE),
      switchMap((action: InvoiceAction.FetchInvoice) => {
        return this.http.get<{ invoice: Invoice[] }>(
          environment.backendUrl + '/invoice/all?program_id=' + get_current_program().id)
          .pipe(
            map(responseData => {
              return new InvoiceAction.SetInvoices(responseData.invoice)
            }),
            catchError(error => {
              console.log(error);
              return of({type: "Error when fetching invoices"});
            }))
      }))
  });

  fetchInvoiceProudcts$ = createEffect(() => {
    return this.action$.pipe(
      ofType(InvoiceAction.FETCH_INVOICE_PRODUCTS),
      switchMap((action: InvoiceAction.FetchInvoiceProducts) => {
        return this.http.get<{ invoice_product: InvoiceProduct[] }>(
          environment.backendUrl + '/invoice_product/all?program_id=' + get_current_program().id)
          .pipe(
            map(responseData => {
              return new InvoiceAction.SetInvoiceProducts(responseData.invoice_product)
            }),
            catchError(error => {
              console.log(error);
              return of({type: "Error when fetching invoice products"});
            }))
      }))
  });

  fetchSuppliers$ = createEffect(() => {
    return this.action$.pipe(
      ofType(InvoiceAction.FETCH_SUPPLIERS),
      switchMap((action: InvoiceAction.FetchSupplier) => {
        return this.http.get<{ supplier: Supplier[] }>(
          environment.backendUrl + '/supplier/all')
          .pipe(
            map(responseData => {
              return new InvoiceAction.SetSuppliers(responseData.supplier)
            }),
            catchError(error => {
              console.log(error);
              return of({type: "Error when fetching suppliers"});
            }))
      }))
  });

  constructor(private action$: Actions,
              private http: HttpClient,
              private store: Store<AppState>) {
  }
}
