import {act, Actions, createEffect, ofType} from "@ngrx/effects";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import * as ProgramActions from "../store/program.action";
import {catchError, of, switchMap, tap} from "rxjs";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";
import {Program} from "../program.model";
import {Router} from "@angular/router";

interface ProgramAddResponse {
  program: Program;
}

// TODO fetch program and set

@Injectable()
export class ProgramEffects {
  onAdd$ = createEffect(() => {
    return this.action$.pipe(
      ofType(ProgramActions.ADD),
      switchMap((programData: ProgramActions.Add) => {
        let prepareBody = {...programData.payload};
        console.log(prepareBody);
        this.store$.select('company').subscribe(resp => {
          if (resp.company) {
            prepareBody.company_id = resp.company.id;
          }
        });
        return this.http.post<ProgramAddResponse>(
          environment.backendUrl + '/program',
          prepareBody).pipe(
          map((respData) => {
            return new ProgramActions.Update(respData.program);
          }),
          catchError(error => {
            console.log(error);
            return of({type: "Dummy_action"});
          }));
      }));

  });

  redirectOnSave = createEffect(() =>
    this.action$.pipe(
      ofType(ProgramActions.UPDATE),
      tap((actionResp: ProgramActions.Update) => {
        this.router.navigate(["programy/" + actionResp.payload.id]);
      })),
    {dispatch: false});

  constructor(private action$: Actions, private http: HttpClient,
              private router: Router,
              private store$: Store<AppState>) {
  }
}
