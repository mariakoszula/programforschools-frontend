import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import * as ProgramActions from "../store/program.action";
import {catchError, of, switchMap, tap, withLatestFrom} from "rxjs";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";
import {Program, ProgramResponse, Week, WeeksResponse} from "../program.model";
import {Router} from "@angular/router";


interface ProgramAddResponse {
  program: Program;
}

interface WeekAddResponse {
  week: Week;
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


  onAddWeek$ = createEffect(() => {
    return this.action$.pipe(
      ofType(ProgramActions.ADD_WEEK),
      withLatestFrom(this.store$.select('programs')),
      switchMap(([currentAction, currentState]) => {
        let programData: ProgramActions.AddWeek = currentAction;
        let prepareBody = {...programData.payload};
        let program_id = currentState.programs[currentState.indexOfSelectedProgram].id;
        prepareBody.program_id = program_id;
        return this.http.post<WeekAddResponse>(
          environment.backendUrl + '/week',
          prepareBody).pipe(
          map((respData) => {
            return new ProgramActions.SaveWeek(respData.week);
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

  redirectOnSaveWeek = createEffect(() =>
      this.action$.pipe(
        ofType(ProgramActions.SAVE_WEEK),
        tap((actionResp: ProgramActions.SaveWeek) => {
          this.router.navigate(["programy/" + actionResp.payload.program_id]);
        })),
    {dispatch: false});

  onSelect$ = createEffect(() => this.action$.pipe(
    ofType(ProgramActions.SELECT),
    withLatestFrom(this.store$.select('programs')),
    switchMap(([_, state]) => {
      let id = null;
      if (state.indexOfSelectedProgram !== -1) {
        const currentProgram = state.programs[state.indexOfSelectedProgram];
        id = currentProgram.id;
        localStorage.setItem("currentProgram", JSON.stringify(currentProgram));
        return this.http.get<WeeksResponse>(environment.backendUrl + '/week/all?program_id=' + id)
          .pipe(
            map(responseData => {
              return new ProgramActions.SetAllWeek(responseData.weeks);
            }),
            catchError(error => {
              console.log(error);
              return of({type: "Dummy_action"});
            }))
      }
       return of({type: "Dummy_action"});
    })));

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
