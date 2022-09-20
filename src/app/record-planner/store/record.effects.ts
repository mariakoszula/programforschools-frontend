import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, of, switchMap} from "rxjs";
import {FetchContracts} from "../../documents/store/documents.action";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";
import * as RecordActions from "./record.action";
import {HttpClient} from "@angular/common/http";
import {Fetch} from "./record.action";
import {Record} from "../record.model";
import {get_current_program} from "../../shared/common.functions";

@Injectable()
export class RecordEffects {
  onFetch$ = createEffect(() => {
    return this.action$.pipe(
      ofType(RecordActions.FETCH),
      switchMap((action: Fetch) => {
        return this.http.get<{records: Record[]}>(environment.backendUrl +
          "/records?program_id=" + get_current_program().id)
          .pipe(
            map(responseData => {
              return new RecordActions.SetRecords(responseData.records)
            }),
            catchError(error => {
              console.log(error);
              return of({type: "Dummy_action"});
            })
          );
      }));
  });

  constructor(private action$: Actions, private http: HttpClient) {
  }
}


