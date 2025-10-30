import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Record} from "./record.model";
import {Observable, of, switchMap} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "../store/app.reducer";
import {Actions, ofType} from "@ngrx/effects";
import {map, take} from "rxjs/operators";
import * as RecordActions from "./store/record.action";
import {Injectable} from "@angular/core";
import {SET_RECORDS} from "./store/record.action";  // ← Use the constant


@Injectable({
  providedIn: 'root'
})
export class RecordResolverService implements Resolve<Record[]> {
  private lastResolvedUrl: string | null = null;
  constructor(private store: Store<AppState>,
              private actions$: Actions) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Record[]> | Promise<Record[]> | Record[] {
    const urlChanged = this.lastResolvedUrl !== state.url;
    this.lastResolvedUrl = state.url;

    return this.store.select("record").pipe(
      take(1),
      switchMap(recordStates => {
        if (urlChanged || recordStates.records.length === 0) {
            this.store.dispatch(new RecordActions.Fetch(state.url));
            return this.actions$.pipe(
              ofType(SET_RECORDS),
              map((action: any) => action.payload.records),
              take(1)
            );
          }

          // Return cached records if URL hasn't changed
          return of(recordStates.records);
      })
    );
  }
}
