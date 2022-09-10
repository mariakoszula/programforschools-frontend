import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {AppState} from "../store/app.reducer";
import {Store} from "@ngrx/store";
import {Observable, of, switchMap} from "rxjs";
import {map, take} from "rxjs/operators";
import * as DocumentsActions from "./store/documents.action";
import {Actions, ofType} from "@ngrx/effects";
import {Injectable} from "@angular/core";
import {Contract} from "./contract.model";
import {SET_CONTRACTS} from "./store/documents.action";

@Injectable({
  providedIn: 'root'
})
export class ContractResolverService implements Resolve<Contract[]> {

  constructor(private store: Store<AppState>,
              private actions$: Actions) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Contract[]> | Promise<Contract[]> | Contract[] {
    return this.store.select("document").pipe(
      take(1),
      map(contractState => {
        return contractState.contracts;
      }),
      switchMap(contracts => {
        if (contracts.length === 0) {
          const currentProgramJson = localStorage.getItem("currentProgram")
          if(currentProgramJson) {
            const program_id = JSON.parse(currentProgramJson)["id"];
            this.store.dispatch(new DocumentsActions.FetchContracts(program_id));
          }
          return this.actions$.pipe(
            ofType(SET_CONTRACTS),
            take(1)
          )
        } else {
          return of(contracts);
        }
      })
    );
  }
}


