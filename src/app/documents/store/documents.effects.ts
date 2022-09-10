import {Contract} from "../contract.model";
import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, of, switchMap, withLatestFrom} from "rxjs";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "../../store/app.reducer";
import * as DocumentsActions from "./documents.action";
import {FetchContracts, GenerateContracts, GenerateRegister} from "./documents.action";
import {convert_date_from_backend_format, convert_date_to_backend_format} from "../../shared/date_converter.utils";

interface ContractsResponse {
  contracts: Contract[];
  documents: string[]
}

interface RegisterResponse {
  documents: string[]
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
      withLatestFrom(this.store$.select('document')),
      switchMap(([_, currentState]) => {
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
                contracts: currentState.contracts,
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
  constructor(private action$: Actions, private http: HttpClient,
              private router: Router,
              private store$: Store<AppState>) {
  }
}
