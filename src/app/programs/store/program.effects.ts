import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import * as ProgramActions from "../store/program.action";
import {catchError, of, switchMap, tap, withLatestFrom} from "rxjs";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";
import {Product, ProductStore, Program, ProgramResponse, Week, WeeksResponse} from "../program.model";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";

export const FRUIT_VEG_PRODUCT = "owocowo-warzywny";
export const DAIRY_PRODUCT = "nabiał";

interface ProgramAddResponse {
  program: Program;
}

interface WeekAddResponse {
  week: Week;
}

interface ProductResponse {
  products: ProductStore[];
}

function update_in_storage_list(json_storage_name: string, new_item: any) {
  if (!new_item) {
    console.log("New Item does not exists");
    return;
  }
  let jsonData = localStorage.getItem(json_storage_name);
  let listTemp = [];
  if (jsonData) {
    listTemp = JSON.parse(jsonData);
  }
  listTemp.push(new_item);
  localStorage.setItem(json_storage_name, JSON.stringify(listTemp));
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
          catchError((error: HttpErrorResponse) => {
            return of(new ProgramActions.ErrorHandler(error.error.message));
          }));
      }));
  });


  onAddWeek$ = createEffect(() => {
    return this.action$.pipe(
      ofType(ProgramActions.ADD_WEEK),
      withLatestFrom(this.store$.select('program')),
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
          catchError((error: HttpErrorResponse) => {
            return of(new ProgramActions.ErrorHandler(error.error.message));
          }));
      }));
  });


  onUpdate$ = createEffect(() => {
    return this.action$.pipe(
      ofType(ProgramActions.UPDATE),
      withLatestFrom(this.store$.select('program')),
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
          catchError((error: HttpErrorResponse) => {
              return of(new ProgramActions.ErrorHandler(error.error.message));
            }
          ));
      }));
  });

  redirectOnSave = createEffect(() =>
      this.action$.pipe(
        ofType(ProgramActions.SAVE),
        tap((actionResp: ProgramActions.Save) => {
          this.router.navigate(["programy/" + actionResp.payload.id]);
        })),
    {dispatch: false});

  redirectAndSaveOnSaveWeek = createEffect(() =>
      this.action$.pipe(
        ofType(ProgramActions.SAVE_WEEK),
        tap((actionResp: ProgramActions.SaveWeek) => {
          update_in_storage_list("currentWeeks", actionResp.payload);
          this.router.navigate(["programy/" + actionResp.payload.program_id]);
        })),
    {dispatch: false});

  onSaveProduct = createEffect(() =>
      this.action$.pipe(
        ofType(ProgramActions.SAVE_PRODUCT),
        tap((actionResp: ProgramActions.SaveProduct) => {
          console.log(actionResp);
          console.log("product types in save: " + actionResp.product_type);
          if (actionResp.product_type === FRUIT_VEG_PRODUCT) {
            update_in_storage_list("currentFruitVegProducts", actionResp.payload);

          } else if (actionResp.product_type === DAIRY_PRODUCT) {
            update_in_storage_list("currentDiaryProducts", actionResp.payload);
          }
        })),
    {dispatch: false});

  onSelect$ = createEffect(() => this.action$.pipe(
    ofType(ProgramActions.SELECT),
    withLatestFrom(this.store$.select('program')),
    switchMap(([_, state]) => {
      let id = null;
      if (state.indexOfSelectedProgram !== -1) {
        const currentProgram = state.programs[state.indexOfSelectedProgram];
        id = currentProgram.id;
        localStorage.setItem("currentProgram", JSON.stringify(currentProgram));
        return this.http.get<WeeksResponse>(environment.backendUrl + '/week/all?program_id=' + id)
          .pipe(
            map(responseData => {
              localStorage.setItem("currentWeeks", JSON.stringify(responseData.weeks));
              return new ProgramActions.SetAllWeek(responseData.weeks);
            }),
            catchError((error: HttpErrorResponse) => {
              return of(new ProgramActions.ErrorHandler(error.error.message));
            }))
      }
      return of({type: "Dummy_action"});
    })));

  onSetAllWeek$ = createEffect(() => this.action$.pipe(
    ofType(ProgramActions.SET_WEEK_ALL),
    withLatestFrom(this.store$.select('program')),
    switchMap(([_, state]) => {
      let id = null;
      if (state.indexOfSelectedProgram !== -1) {
        const currentProgram = state.programs[state.indexOfSelectedProgram];
        id = currentProgram.id;
        return this.http.get<ProductResponse>(environment.backendUrl + '/product_store?program_id=' + id
          + '&product_type=' + FRUIT_VEG_PRODUCT)
          .pipe(
            map(responseData => {
              localStorage.setItem("currentFruitVegProducts", JSON.stringify(responseData.products));
              return new ProgramActions.SetAllFruitVegProducts(responseData.products);
            }),
            catchError((error: HttpErrorResponse) => {
              return of(new ProgramActions.ErrorHandler(error.error.message));
            }))
      }
      return of({type: "Dummy_action"});
    })));

  onSetAllFruitVegProducts$ = createEffect(() => this.action$.pipe(
    ofType(ProgramActions.SET_ALL_FRUIT_VEG_PRODUCTS),
    withLatestFrom(this.store$.select('program')),
    switchMap(([_, state]) => {
      let id = null;
      if (state.indexOfSelectedProgram !== -1) {
        const currentProgram = state.programs[state.indexOfSelectedProgram];
        id = currentProgram.id;
        return this.http.get<ProductResponse>(environment.backendUrl + '/product_store?program_id=' + id
          + '&product_type=' + DAIRY_PRODUCT)
          .pipe(
            map(responseData => {
              localStorage.setItem("currentDiaryProducts", JSON.stringify(responseData.products));
              return new ProgramActions.SetAllDairyProducts(responseData.products);
            }),
            catchError((error: HttpErrorResponse) => {
              return of(new ProgramActions.ErrorHandler(error.error.message));
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
              localStorage.removeItem("currentWeeks");
              localStorage.removeItem("currentDiaryProducts");
              localStorage.removeItem("currentFruitVegProducts");
              return new ProgramActions.SetAll(responseData.programs);
            }),
          );
      }));
  });

  onFetchProductType$ = createEffect(() => {
    return this.action$.pipe(
      ofType(ProgramActions.FETCH_PRODUCT_TYPE),
      switchMap(() => {
        return this.http.get<{ product_type: string[] }>(environment.backendUrl + '/product_type')
          .pipe(
            map(responseData => {
              return new ProgramActions.SetProductType(responseData.product_type);
            }),
          );
      }));
  });

  onFetchProduct$ = createEffect(() => {
    return this.action$.pipe(
      ofType(ProgramActions.FETCH_PRODUCT),
      switchMap(() => {
        return this.http.get<{ product: Product[] }>(environment.backendUrl + '/product')
          .pipe(
            map(responseData => {
              return new ProgramActions.SetProducts(responseData.product);
            }),
          );
      }));
  });

  onAddProduct$ = createEffect(() => {
    return this.action$.pipe(
      ofType(ProgramActions.ADD_PRODUCT),
      withLatestFrom(this.store$.select('program')),
      switchMap(([currentAction, currentState]) => {

        let programData: ProgramActions.AddProduct = currentAction;
        let prepareBody = {...programData.payload};
        let program_id = currentState.programs[currentState.indexOfSelectedProgram].id;
        prepareBody.program_id = program_id;
        return this.http.post<{product_store: ProductStore}>(
          environment.backendUrl + '/product_store',
          prepareBody).pipe(
          map((respData) => {
            return new ProgramActions.SaveProduct(programData.product_type, respData.product_store);
          }),
          catchError((error: HttpErrorResponse) => {
            console.log(error);
            return of(new ProgramActions.ErrorHandler(error.error.message));
          }));
      }));
  });

  constructor(private action$: Actions, private http: HttpClient,
              private router: Router,
              private store$: Store<AppState>) {
  }
}
