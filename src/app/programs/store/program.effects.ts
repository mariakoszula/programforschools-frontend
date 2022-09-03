import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import * as ProgramActions from "../store/program.action";
import {catchError, of, switchMap, tap, withLatestFrom} from "rxjs";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";
import {Program, ProgramResponse} from "../program.model";
import {Router} from "@angular/router";


interface ProgramAddResponse {
  program: Program;
}


@Injectable()
export class ProgramEffects {
  onAdd$ = createEffect(() => {
    return this.action$.pipe(
      ofType(ProgramActions.ADD),
      switchMap((programData: ProgramActions.Add) => {
        let prepareBody = {...programData.payload};
        this.store$.select('company').subscribe(resp => {
          if (resp.company) {
            prepareBody.company_id = resp.company.id;
          }
        });
        return this.http.post<ProgramAddResponse>(
          environment.backendUrl + '/program',
          prepareBody).pipe(
          map((respData) => {
            return new ProgramActions.Save(respData.program);
          }),
          catchError(error => {
            console.log(error);
            return of({type: "Dummy_action"});
          }));
      }));
  });


  onUpdate$ = createEffect(() => {
    return this.action$.pipe(
      ofType(ProgramActions.UPDATE),
      withLatestFrom(this.store$.select('programs')),
      switchMap(([currentAction, currentState]) => {
        let programData: ProgramActions.Update = currentAction;
        let prepareBody = {...programData.payload};
        let id = currentState.programs[currentState.indexOfSelectedProgram].id;
        return this.http.put<ProgramAddResponse>(
          environment.backendUrl + '/program/' + id,
          prepareBody).pipe(
          map((respData) => {
            localStorage.setItem("currentProgram", JSON.stringify(respData.program));
            return new ProgramActions.Save(respData.program);
          }),
          catchError(error => {
            console.log(error);
            return of({type: "Dummy_action"});
          }));
      }));
  });

  redirectOnSave = createEffect(() =>
      this.action$.pipe(
        ofType(ProgramActions.SAVE),
        tap((actionResp: ProgramActions.Save) => {
          this.router.navigate(["programy/" + actionResp.payload.id]);
        })),
    {dispatch: false});

  onSelect = createEffect(() => this.action$.pipe(
    ofType(ProgramActions.SELECT),
    withLatestFrom(this.store$.select('programs')),
    tap(([_, state]) => {
      if (state.indexOfSelectedProgram !== -1)
        localStorage.setItem("currentProgram", JSON.stringify(state.programs[state.indexOfSelectedProgram]));
    })
  ), {dispatch: false});

  onFetch$ = createEffect(() => {
    return this.action$.pipe(
      ofType(ProgramActions.FETCH),
      switchMap(() => {
        return this.http.get<ProgramResponse>(environment.backendUrl + '/program/all')
          .pipe(
            map(responseData => {
              localStorage.removeItem("currentProgram");
              return new ProgramActions.SetAll(responseData.programs);
            }),
          );
      }));
  });

  constructor(private action$: Actions, private http: HttpClient,
              private router: Router,
              private store$: Store<AppState>) {
  }
}
