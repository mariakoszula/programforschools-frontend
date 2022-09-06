import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, of, switchMap, tap} from "rxjs";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";
import * as SchoolActions from "./schools.action";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.reducer";
import {School} from "../school.model";

interface SchoolAddResponse {
  school: School;
}

interface SchoolsResponse{
  schools: School[];
}
@Injectable()
export class SchoolsEffects {
  onAdd$ = createEffect(() => {
    return this.action$.pipe(
      ofType(SchoolActions.ADD),
      switchMap((schoolData: SchoolActions.Add) => {
        return this.http.post<SchoolAddResponse>(
          environment.backendUrl + '/school',
          {...schoolData.payload}).pipe(
          map((respData) => {
            return new SchoolActions.Save(respData.school);
          }),
          catchError(error => {
            console.log(error);
            return of({type: "Dummy_action"});
          }));
      }));
  });

  redirectOnSave = createEffect(() =>
      this.action$.pipe(
        ofType(SchoolActions.SAVE),
        tap(() => {
          this.router.navigate(["szkoly"]);
        })),
    {dispatch: false});


  onFetch$ = createEffect(() => {
    return this.action$.pipe(
      ofType(SchoolActions.FETCH),
      switchMap(() => {
        return this.http.get<SchoolsResponse>(environment.backendUrl + '/school/all')
          .pipe(
            map(responseData => {
              return new SchoolActions.SetAll(responseData.schools);
            }),
          );
      }));
  });

  constructor(private action$: Actions, private http: HttpClient,
              private router: Router,
              private store$: Store<AppState>) {
  }
}
