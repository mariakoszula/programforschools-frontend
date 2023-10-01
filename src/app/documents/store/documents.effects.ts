import {Annex, Contract, Application} from "../contract.model";
import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, of, switchMap, takeUntil, tap, timer, withLatestFrom} from "rxjs";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.reducer";
import * as DocumentsActions from "./documents.action";
import * as RecordsActions from "../../record-planner/store/record.action";
import {
  CreateApplication,
  FetchApplication,
  FetchContracts, GenerateApplications,
  GenerateContracts,
  GenerateDelivery, GenerateWeekSummary,
  QueueGeneratingTaskAndStartPolling,
  UpdateAnnex, UpdateApplication,
  UpdateKidsNo
} from "./documents.action";
import {convert_date_to_backend_format} from "../../shared/date_converter.utils";
import {get_current_program} from "../../shared/common.functions";
import {
  FINISHED_TASK_PROGRESS, getQueueEntities, POLLING_INTERVAL
} from "./documents.reducer";
import {DAIRY_PRODUCT, FRUIT_VEG_PRODUCT} from "../../shared/namemapping.utils";

interface ContractsResponse {
  contracts: Contract[];
  documents: string[]
}

interface ResponseWithDocuments {
  documents: string[]
}

interface AnnexResponse {
  annex: Annex;
  documents: string[]
}

interface ContractResponse {
  contract: Contract;
}

interface QueuedTaskResponse {
  task_id: string;
}

interface QueuedTaskProgressResponse {
  progress: number;
  documents: string[];
}


@Injectable()
export class DocumentsEffects {
  onFetchContracts$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DocumentsActions.FETCH_CONTRACTS),
      switchMap((action: FetchContracts) => {
        return this.http.get<ContractsResponse>(environment.backendUrl +
          "/contracts/" + get_current_program().id + "/all")
          .pipe(
            map(responseData => {
              localStorage.setItem("currentContract",  JSON.stringify(responseData.contracts));
              return new DocumentsActions.SetContracts({
                contracts: responseData.contracts,
                documents: []
              })
            }),
            catchError(error => {
              console.log(error);
              return of({type: "Dummy_action"});
            })
          );
      }));
  });
  onGenerateContracts$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DocumentsActions.GENERATE_CONTRACTS),
      switchMap((action: GenerateContracts) => {
        return this.http.put<QueuedTaskResponse>(environment.backendUrl +
          "/create_contracts?program_id=" + get_current_program().id
          + "&date=" + convert_date_to_backend_format(action.payload.contract_date)
          + "&schools_list=" + action.payload.school_ids.join(","), {})
          .pipe(
            map(responseData => {
              return new DocumentsActions.QueueGeneratingTaskAndStartPolling({
                id: responseData.task_id,
                name: "Umowy:".concat(action.payload.contract_date)
              });
            }),
            catchError(error => {
              console.log(error);
              return of({type: "Dummy_action"});
            })
          );
      }));
  });

  onGenerateRegister$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DocumentsActions.GENERATE_REGISTER),
      switchMap((_) => {
        return this.http.get<QueuedTaskResponse>(environment.backendUrl +
          "/create_school_register/" + get_current_program().id)
          .pipe(
            map(responseData => {
              return new DocumentsActions.QueueGeneratingTaskAndStartPolling({
                id: responseData.task_id,
                name: "Rejestr"
              });
            }),
            catchError(error => {
              console.log(error);
              return of({type: "Dummy_action"});
            })
          );
      }));
  });

    onGenerateApplications$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DocumentsActions.GENERATE_APPLICATION),
      switchMap((action: GenerateApplications) => {
        return this.http.put<QueuedTaskResponse>(environment.backendUrl +
          "/create_application/" + action.payload.id, {
          "date": convert_date_to_backend_format(action.payload.app_date),
          "start_week": action.payload.start_week,
          "is_last": action.payload.is_last
        })
          .pipe(
            map(responseData => {
              return new DocumentsActions.QueueGeneratingTaskAndStartPolling({
                id: responseData.task_id,
                name: "Wniosek:".concat(action.payload.no.toString())
              });
            }),
            catchError(error => {
              console.log(error);
              return of({type: "Dummy_action"});
            })
          );
      }));
  });

  onUpdateAnnex$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DocumentsActions.UPDATE_ANNEX),
      switchMap((action: UpdateAnnex) => {
        return this.http.put<AnnexResponse>(environment.backendUrl +
          "/annex/" + action.payload.contract_id
          + "?date=" + action.payload.sign_date,
          {...action.payload})
          .pipe(
            map(responseData => {
              return new DocumentsActions.SetAnnex({
                annex: responseData.annex,
                documents: responseData.documents.filter((document_info: string) => {
                  return document_info.includes("pdf")
                })
              });
            }),
            catchError(error => {
              console.log(error);
              return of({type: "Dummy_action"});
            })
          );
      }));
  });
  onUpdateKidsNo$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DocumentsActions.UPDATE_KIDS_NO),
      switchMap((action: UpdateKidsNo) => {
        return this.http.put<ContractResponse>(environment.backendUrl +
          "/contract/" + get_current_program().id + "/" + action.school_id,
          {...action.payload})
          .pipe(
            map(responseData => {
              return new DocumentsActions.SetContracts({
                contracts: [responseData.contract],
                documents: []
              });
            }),
            catchError(error => {
              console.log(error);
              return of({type: "Dummy_action"});
            })
          );
      }));
  });
  redirectOnSet = createEffect(() =>
      this.action$.pipe(
        ofType(DocumentsActions.SET_ANNEX, DocumentsActions.SET_CONTRACTS),
        tap(() => {
          this.router.navigate(["/dokumenty/umowy"]).then(() => {
          });
        })),
    {dispatch: false});

  onGenerateDelivery$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DocumentsActions.GENERATE_DELIVERY),
      switchMap((action: GenerateDelivery) => {
        let record_ids: number[] = [];
        action.records.forEach(record => record_ids.push(record.id));
        let prepareBody: { [key: string]: any } = {records: record_ids};
        if (action.comments) {
          prepareBody['comments'] = action.comments;
        }
        let put_driver = "";
        if (action.driver) {
          put_driver = "&driver=" + action.driver
        }
        return this.http.put<QueuedTaskResponse>(environment.backendUrl +
          "/create_delivery?date=" + action.delivery_date + put_driver,
          {...prepareBody})
          .pipe(
            map(responseData => {
              return new DocumentsActions.QueueGeneratingTaskAndStartPolling({
                id: responseData.task_id,
                name: "Dostawa:".concat(action.driver, " ", action.delivery_date)
              });
            }),
            catchError(error => {
              console.log(error);
              return of({type: "Dummy_action"});
            })
          );
      }));
  });

    onGenerateWeekSummary$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DocumentsActions.GENERATE_WEEK_SUMMARY),
      switchMap((action: GenerateWeekSummary) => {
        return this.http.get<QueuedTaskResponse>(environment.backendUrl +
          "/summarize_week_delivery/" + action.week.id)
          .pipe(
            map(responseData => {
              return new DocumentsActions.QueueGeneratingTaskAndStartPolling({
                id: responseData.task_id,
                name: "Rozpiska: Tydzień_".concat(String(action.week.week_no))
              });
            }),
            catchError(error => {
              console.log(error);
              return of({type: "Dummy_action failed generate week summary"});
            })
          );
      }));
  });

  onQueueGeneratingTask$ = createEffect(() =>
    this.action$.pipe(
      ofType(DocumentsActions.QUEUE_GENERATING_TASK_AND_START_POLLING),
      switchMap((action: QueueGeneratingTaskAndStartPolling) => {
        return timer(0, POLLING_INTERVAL).pipe(
          takeUntil(this.action$.pipe(ofType(DocumentsActions.STOP_POLLING))),
          switchMap(() => {
            return this.http.get<QueuedTaskProgressResponse>(environment.backendUrl +
              "/task_progress/" + action.payload.id)
              .pipe(
                map(responseData => {
                  let _documents: string[] = [];
                  if (responseData.progress === FINISHED_TASK_PROGRESS) {
                    if (responseData.documents) {
                      _documents = responseData.documents.filter((document_info: string) => document_info.includes("pdf"));
                    }
                  };
                  return new DocumentsActions.SetTaskProgress({
                    id: action.payload.id,
                    progress: responseData.progress,
                    documents: _documents
                  });
                }),
                catchError(error => {
                  console.log(error);
                  return of({type: "Dummy_action"});
                })
              );
          }),
        );
      })
    )
  );

  fetchRecordsOnFinishStopPollingDelivery = createEffect(() =>
      this.action$.pipe(
        ofType(DocumentsActions.SET_TASK_PROGRESS),
        withLatestFrom(this.store.select("document")),
        tap(([_, state]) => {
          if (Object.values(getQueueEntities(state)).every(value => value && value.progress === FINISHED_TASK_PROGRESS)) {
            this.store.dispatch(new RecordsActions.Fetch());
            this.store.dispatch(new DocumentsActions.StopPolling());
          }
        })),
    {dispatch: false});

    onFetchApplication$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DocumentsActions.FETCH_APPLICATION),
      switchMap((action: FetchApplication) => {
        return this.http.get<{application: Application[]}>(environment.backendUrl +
          "/application/all?program_id=" +  get_current_program().id)
          .pipe(
            map(responseData => {
              return new DocumentsActions.SetApplications(responseData.application)
            }),
            catchError(error => {
              console.log(error);
              return of({type: "Dummy_action"});
            })
          );
      }));
  });

    onAddApplication = createEffect(() => {
    return this.action$.pipe(
      ofType(DocumentsActions.CREATE_APPLICATION),
      switchMap((action: CreateApplication) => {
        // FULL = 0
        // DAIRY = 1
        // FRUIT_VEG = 2
        let contracts_ids: number[] = [];
        let weeks_ids: number[] = [];
        let type: number = 0;
        for(let contract of action.payload.contracts){
          contracts_ids.push(contract.id);
        }
        for(let week of action.payload.weeks){
          weeks_ids.push(week.id);
        }
        if (action.payload.type === DAIRY_PRODUCT) {
          type = 1;
        } else if (action.payload.type === FRUIT_VEG_PRODUCT) {
          type = 2;
        }
        return this.http.post<{ application: Application}>(
          environment.backendUrl + '/application',
          {
              program_id: get_current_program().id,
              contracts: contracts_ids,
              weeks: weeks_ids,
              app_type: type,
          }).pipe(
          map((respData) => {
            return new DocumentsActions.FetchApplication();
          }),
          catchError((error: HttpErrorResponse) => {
            console.log(error);
            return of({type: "Dummy_action"});
          }));
      }));
  });

    onUpdateApplication = createEffect(() => {
    return this.action$.pipe(
      ofType(DocumentsActions.UPDATE_APPLICATION),
      switchMap((action: UpdateApplication) => {
        let contracts_ids: number[] = [];
        let weeks_ids: number[] = [];
        for(let contract of action.payload.contracts){
          contracts_ids.push(contract.id);
        }
        for(let week of action.payload.weeks){
          weeks_ids.push(week.id);
        }
        return this.http.put<{ application: Application}>(
          environment.backendUrl + '/application/' + action.payload.id,
          {
              contracts: contracts_ids,
              weeks: weeks_ids
          }).pipe(
          map((respData) => {
            return new DocumentsActions.FetchApplication();
          }),
          catchError((error: HttpErrorResponse) => {
            console.log(error);
            return of({type: "Dummy_action"});
          }));
      }));
  });
  constructor(private action$: Actions, private http: HttpClient,
              private router: Router,
              private store: Store<AppState>) {
  }
}
