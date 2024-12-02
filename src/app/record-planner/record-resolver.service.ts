import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Record} from "./record.model";
import {Observable, of, switchMap} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "../store/app.reducer";
import {Actions, ofType} from "@ngrx/effects";
import {map, take} from "rxjs/operators";
import * as RecordActions from "./store/record.action";
import {SET_RECORDS} from "./store/record.action";
import {Injectable} from "@angular/core";
import {MAXIMUM_RESOLVER_TIMES} from "../shared/common.functions";

@Injectable({
  providedIn: 'root'
})
export class RecordResolverService implements Resolve<Record[]> {
  resolved: number = 0;
  constructor(private store: Store<AppState>,
              private actions$: Actions) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Record[]> | Promise<Record[]> | Record[] {
    return this.store.select("record").pipe(
      take(1),
      map(recordStates => {
        return recordStates.records;
      }),
      switchMap(records => {
        if (records.length === 0 && (this.resolved <= MAXIMUM_RESOLVER_TIMES)) {
          console.log("resolving " + state.url);
          this.store.dispatch(new RecordActions.Fetch(state.url));
          this.resolved += 1;
          return this.actions$.pipe(
            ofType(SET_RECORDS),
            take(1)
          )
        } else {
          return of(records);
        }
      })
    );
  }
}
