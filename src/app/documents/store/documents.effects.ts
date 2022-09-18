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
import {FetchContracts, GenerateContracts, UpdateAnnex, UpdateKidsNo} from "./documents.action";
import {convert_date_to_backend_format} from "../../shared/date_converter.utils";

interface ContractsResponse {
  contracts: Contract[];
  documents: string[]
}

interface RegisterResponse {
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
        const jsonProgram = localStorage.getItem("currentProgram");
        if (!jsonProgram) {
          throw new Error("CurrentProgram not found in localStorage");
        }
        const current_program = JSON.parse(jsonProgram);
        return this.http.get<ContractsResponse>(environment.backendUrl +
          "/create_contracts?program_id=" + current_program.id
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
        const jsonProgram = localStorage.getItem("currentProgram");
        if (!jsonProgram) {
          throw new Error("CurrentProgram not found in localStorage");
        }
        const current_program = JSON.parse(jsonProgram);
        return this.http.get<RegisterResponse>(environment.backendUrl +
          "/create_school_register/" + current_program.id)
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
              localStorage.removeItem("refresh");
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
        const jsonProgram = localStorage.getItem("currentProgram");
        if (!jsonProgram) {
          throw new Error("CurrentProgram not found in localStorage");
        }
        const current_program = JSON.parse(jsonProgram);
        return this.http.put<ContractResponse>(environment.backendUrl +
          "/contract/" + current_program.id + "/" + action.school_id,
          {...action.payload})
          .pipe(
            map(responseData => {
              localStorage.removeItem("refresh");
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
          let refresh = localStorage.getItem("refresh");
          this.router.navigate(["/dokumenty/umowy"]).then(() => {
            if (!refresh) {
              window.location.reload();
              localStorage.setItem("refresh", "1");
            }
          });
        })),
    {dispatch: false});


  constructor(private action$: Actions, private http: HttpClient,
              private router: Router,
              private store$: Store<AppState>) {
  }
}
