import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {AppState} from "../store/app.reducer";
import {Store} from "@ngrx/store";
import {Observable, of, switchMap} from "rxjs";
import {map, take} from "rxjs/operators";
import * as DocumentsActions from "./store/documents.action";
import {Actions, ofType} from "@ngrx/effects";
import {Injectable} from "@angular/core";
import {Application, Contract} from "./contract.model";
import {SET_APPLICATIONS, SET_CONTRACTS} from "./store/documents.action";
import { MAXIMUM_RESOLVER_TIMES} from "../shared/common.functions";

@Injectable({
  providedIn: 'root'
})
export class ContractResolverService implements Resolve<Contract[]> {
  resolved: number = 0;

  constructor(private store: Store<AppState>, private actions$: Actions) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Contract[]> {
    return this.store.select("document").pipe(
      take(1),
      map(contractState => contractState.contracts),
      switchMap(contracts => {
        if (contracts.length === 0 && this.resolved <= MAXIMUM_RESOLVER_TIMES) {
          const currentProgramJson = localStorage.getItem("currentProgram");
          if (currentProgramJson) {
            this.store.dispatch(new DocumentsActions.FetchContracts());
            this.resolved += 1;
            return this.actions$.pipe(
              ofType(SET_CONTRACTS),
              take(1),
              map(() => contracts)  // ← Return contracts after action received
            );
          }
        }
        return of(contracts);  // ← Always return contracts
      })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationResolverService implements Resolve<Application[]> {
  resolved: number = 0;

  constructor(private store: Store<AppState>, private actions$: Actions) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Application[]> {
    return this.store.select("document").pipe(
      take(1),
      map(state => state.applications),
      switchMap(applications => {
        if (applications.length === 0 && this.resolved <= MAXIMUM_RESOLVER_TIMES) {
          const currentProgramJson = localStorage.getItem("currentProgram");
          if (currentProgramJson) {
            this.store.dispatch(new DocumentsActions.FetchApplication());
            this.resolved += 1;
            return this.actions$.pipe(
              ofType(SET_APPLICATIONS),
              take(1),
              map(() => applications)  // ← Return applications after action received
            );
          }
        }
        return of(applications);  // ← Always return applications
      })
    );
  }
}
