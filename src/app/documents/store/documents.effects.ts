import {Annex, Contract} from "../contract.model";
import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, of, switchMap, tap} from "rxjs";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.reducer";
import * as DocumentsActions from "./documents.action";
import * as RecordsActions from "../../record-planner/store/record.action";
import {FetchContracts, GenerateContracts, GenerateDelivery, UpdateAnnex, UpdateKidsNo} from "./documents.action";
import {convert_date_to_backend_format} from "../../shared/date_converter.utils";
import {get_current_program} from "../../shared/common.functions";

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

@Injectable()
export class DocumentsEffects {
  onFetchContracts$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DocumentsActions.FETCH_CONTRACTS),
      switchMap((action: FetchContracts) => {
        return this.http.get<ContractsResponse>(environment.backendUrl +
          "/contracts/" + action.payload + "/all")
          .pipe(
            map(responseData => {
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
        return this.http.get<ContractsResponse>(environment.backendUrl +
          "/create_contracts?program_id=" + get_current_program().id
          + "&date=" + convert_date_to_backend_format(action.payload.contract_date)
          + "&schools_list=" + action.payload.school_ids.join(","))
          .pipe(
            map(responseData => {
              return new DocumentsActions.SetContracts({
                contracts: responseData.contracts,
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

  onGenerateRegister$ = createEffect(() => {
    return this.action$.pipe(
      ofType(DocumentsActions.GENERATE_REGISTER),
      switchMap((_) => {
        return this.http.get<ResponseWithDocuments>(environment.backendUrl +
          "/create_school_register/" + get_current_program().id)
          .pipe(
            map(responseData => {
              return new DocumentsActions.SetContracts({
                contracts: [],
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
        let prepareBody: {[key: string]: any} = {records: record_ids};
        if (action.comments) {
          prepareBody['comments'] = action.comments;
        }
        return this.http.put<ResponseWithDocuments>(environment.backendUrl +
          "/create_delivery?date=" + action.delivery_date + "&driver=" + action.driver,
          {...prepareBody})
          .pipe(
            map(responseData  => {
              return new DocumentsActions.FinishGenerateDelivery(
                responseData.documents.filter((document_info: string) => {
                  return document_info.includes("pdf")}));
            }),
            catchError(error => {
              console.log(error);
              return of({type: "Dummy_action"});
            })
          );
      }));
  });

  fetchRecordsOnFinishDelivery = createEffect(() =>
      this.action$.pipe(
        ofType(DocumentsActions.FINISH_GENERATE_DELIVERY),
        tap(() => {
          this.store.dispatch(new RecordsActions.Fetch());
        })),
    {dispatch: false});

  constructor(private action$: Actions, private http: HttpClient,
              private router: Router,
              private store: Store<AppState>) {
  }
}
