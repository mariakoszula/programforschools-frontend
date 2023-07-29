import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {AppState} from "src/app/store/app.reducer";
import {Store} from "@ngrx/store";
import {catchError, of, switchMap, tap, withLatestFrom} from "rxjs";
import {environment} from "../../../environments/environment";
import {Invoice, InvoiceProduct, Supplier} from "../invoice.model";
import * as InvoiceAction from "./invoice.action";
import {map} from "rxjs/operators";
import {get_current_program} from "../../shared/common.functions";
import {Router} from "@angular/router";

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

  onAddInvoice$ = createEffect(() => {
    return this.action$.pipe(
      ofType(InvoiceAction.ADD_INVOICE),
      switchMap((data: InvoiceAction.AddInvoice) => {
        return this.http.post<{ invoice: Invoice }>(
          environment.backendUrl + '/invoice',
          {...data.payload}).pipe(
          map((respData) => {
            return new InvoiceAction.SaveInvoice(respData.invoice);
          }),
          catchError(error => {
            console.log(error);
            return of({type: "Error during adding invoice"});
          }));
      }));
  });

  onUpdateInvoice$ = createEffect(() => {
    return this.action$.pipe(
      ofType(InvoiceAction.UPDATE_INVOICE),
      withLatestFrom(this.store$.select('invoice')),
      switchMap(([currentAction, _]) => {
        let data: InvoiceAction.UpdateInvoice = currentAction;
        return this.http.put<{ invoice: Invoice }>(
          environment.backendUrl + '/invoice/' + data.invoice_id,
          {...data.payload}).pipe(
          map((respData) => {
            return new InvoiceAction.SaveInvoice(respData.invoice);
          }),
          catchError(error => {
            console.log(error);
            return of({type: "Failed on update invoice"});
          }));
      }));
  });

  redirectOnSaveInvoice = createEffect(() =>
      this.action$.pipe(
        ofType(InvoiceAction.SAVE_INVOICE),
        tap(() => {
          this.router.navigate(["faktury/faktury"]);
        })),
    {dispatch: false});

  fetchInvoiceProducts$ = createEffect(() => {
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

  onAddSupplier$ = createEffect(() => {
    return this.action$.pipe(
      ofType(InvoiceAction.ADD_SUPPLIER),
      switchMap((data: InvoiceAction.AddSupplier) => {
        return this.http.post<{ supplier: Supplier }>(
          environment.backendUrl + '/supplier',
          {...data.payload}).pipe(
          map((respData) => {
            return new InvoiceAction.SaveSupplier(respData.supplier);
          }),
          catchError(error => {
            console.log(error);
            return of({type: "Error during adding supplier"});
          }));
      }));
  });

  onUpdateSupplier$ = createEffect(() => {
    return this.action$.pipe(
      ofType(InvoiceAction.UPDATE_SUPPLIER),
      withLatestFrom(this.store$.select('invoice')),
      switchMap(([currentAction, _]) => {
        let data: InvoiceAction.UpdateSupplier = currentAction;
        return this.http.put<{ supplier: Supplier }>(
          environment.backendUrl + '/supplier/' + data.supplier_id,
          {...data.payload}).pipe(
          map((respData) => {
            return new InvoiceAction.SaveSupplier(respData.supplier);
          }),
          catchError(error => {
            console.log(error);
            return of({type: "Failed on update suppliers"});
          }));
      }));
  });

  redirectOnSaveSupplier = createEffect(() =>
      this.action$.pipe(
        ofType(InvoiceAction.SAVE_SUPPLIER),
        tap(() => {
          this.router.navigate(["/faktury/dostawcy"]);
        })),
    {dispatch: false});

  constructor(private action$: Actions,
              private http: HttpClient,
              private router: Router,
              private store$: Store<AppState>) {
  }
}
