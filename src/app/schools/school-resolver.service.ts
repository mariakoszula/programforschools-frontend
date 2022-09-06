import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {AppState} from "../store/app.reducer";
import {Store} from "@ngrx/store";
import {Observable, of, switchMap} from "rxjs";
import {map, take} from "rxjs/operators";
import * as SchoolActions from "./store/schools.action";
import {Actions, ofType} from "@ngrx/effects";
import {SET_ALL} from "./store/schools.action";
import {Injectable} from "@angular/core";
import {School} from "./school.model";

@Injectable({
  providedIn: 'root'
})
export class SchoolResolverService implements Resolve<School[]> {

  constructor(private store: Store<AppState>,
              private actions$: Actions) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<School[]> | Promise<School[]> | School[] {
    return this.store.select("school").pipe(
      take(1),
      map(schoolState => {
        return schoolState.schools;
      }),
      switchMap(schools => {
        if (schools.length === 0) {
          this.store.dispatch(new SchoolActions.Fetch());
          return this.actions$.pipe(
            ofType(SET_ALL),
            take(1)
          )
        } else {
          return of(schools);
        }
      })
    );
  }
}
