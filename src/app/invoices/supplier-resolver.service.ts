import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {AppState} from "../store/app.reducer";
import {Store} from "@ngrx/store";
import {Observable, of, switchMap} from "rxjs";
import {map, take} from "rxjs/operators";
import {Actions, ofType} from "@ngrx/effects";
import {Injectable} from "@angular/core";
import {Supplier} from "./invoice.model";
import * as InvoiceAction from "./store/invoice.action";
@Injectable({
  providedIn: 'root'
})
export class SuppliersResolverService implements Resolve<Supplier[]> {

  constructor(private store: Store<AppState>,
              private actions$: Actions) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Supplier[]> | Promise<Supplier[]> | Supplier[] {
    return this.store.select("invoice").pipe(
      take(1),
      map(supplierState => {
        return supplierState.suppliers;
      }),
      switchMap(supplier => {
        if (supplier.length === 0) {
          this.store.dispatch(new InvoiceAction.FetchSupplier());
          return this.actions$.pipe(
            ofType(InvoiceAction.SET_SUPPLIERS),
            take(1)
          )
        } else {
          return of(supplier);
        }
      })
    );
  }
}
