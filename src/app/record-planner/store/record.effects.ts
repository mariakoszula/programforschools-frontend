import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, of, switchMap, tap} from "rxjs";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";
import * as RecordActions from "./record.action";
import {HttpClient} from "@angular/common/http";
import {AddRecords, DeleteRecord, Fetch, UpdateRecord} from "./record.action";
import {
  AdditionRecordsResponse,
  Record,
  RecordAddResult,
  RecordAdditionResultInfo, RecordUpdateResult, get_state_number,
} from "../record.model";
import {get_current_program, get_weeks} from "../../shared/common.functions";
import {ActivatedRoute, Router} from "@angular/router";
import {is_date_in_range} from "../../shared/date_converter.utils";
import {Week} from "../../programs/program.model";

function handle_record_response(recordsResult: RecordAddResult[], failed: RecordAddResult[]) {
  let successful: Record[] = [];
  recordsResult.forEach(recordRes => {
    if (recordRes.result === RecordAdditionResultInfo.SUCCESS && recordRes.record) {
      successful.push(recordRes.record);
    } else {
      failed.push(recordRes);
    }
  });
  return successful;
}


@Injectable()
export class RecordEffects {
  onFetch$ = createEffect(() => {
    return this.action$.pipe(
      ofType(RecordActions.FETCH),
      switchMap((action: Fetch) => {
        return this.http.get<{ records: Record[] }>(environment.backendUrl +
          "/records?program_id=" + get_current_program().id)
          .pipe(
            map(responseData => {
              return new RecordActions.SetRecords({
                records: responseData.records,
                recordsFailedResponse: null
              })
            }),
            catchError(error => {
              console.log(error);
              return of({type: "Dummy_action"});
            })
          );
      }));
  });

  onUpdate$ = createEffect(() => {
    return this.action$.pipe(
      ofType(RecordActions.UPDATE_RECORD),
      switchMap((action: UpdateRecord) => {
        return this.http.put<RecordUpdateResult>(environment.backendUrl +
          "/record/" + action.payload.id, {
          'state': get_state_number(action.payload.state),
          'product_store_id': action.payload.product_store_id
        })
          .pipe(
            map(responseData => {
              return new RecordActions.UpdateRecordConfirmed(responseData.record)
            }),
            catchError(error => {
              console.log(error);
              return of({type: "Dummy_action"});
            })
          );
      }));
  });

  onAddRecords$ = createEffect(() => {
    return this.action$.pipe(
      ofType(RecordActions.ADD_RECORDS),
      switchMap((action: AddRecords) => {
        if (!action.payload.recordsDemand) {
          throw Error("RecordDemand cannot be empty");
        }
        let recordWithProduct = action.payload.recordsDemand.filter(recordDemand => recordDemand.fruitVeg.name !== "" ||
          recordDemand.dairy.name !== "");
        if (recordWithProduct && recordWithProduct.length === 0) {
          throw Error("Record Demand received does not contain any products");
        }
        let recordAddRequests: { nick: string, products: string[] }[] = []
        recordWithProduct.forEach(recordDemand => {
          let products = [];
          if (recordDemand.fruitVeg.name !== "") products.push(recordDemand.fruitVeg.name)
          if (recordDemand.dairy.name !== "") products.push(recordDemand.dairy.name)
          recordAddRequests.push({nick: recordDemand.nick, products: products})
        });
        return this.http.post<AdditionRecordsResponse>(environment.backendUrl +
          "/records?program_id=" + get_current_program().id,
          {
            date: action.payload.date,
            records: recordAddRequests
          })
          .pipe(
            map(responseData => {
              let failedData: RecordAddResult[] = [];
              let successfulRecords = handle_record_response(responseData.records, failedData)
              return new RecordActions.SetRecords({
                records: successfulRecords,
                recordsFailedResponse: {date: responseData.date, records: failedData}
              })
            }),
            catchError(error => {
              console.log(error);
              return of({type: "Dummy_action"});
            })
          );
      }));
  });

  onDelete$ = createEffect(() => {
    return this.action$.pipe(
      ofType(RecordActions.DELETE_RECORD),
      switchMap((action: DeleteRecord) => {
        return this.http.delete<{ deleted_record: number }>(environment.backendUrl +
          "/record/" + action.id)
          .pipe(
            map(responseData => {
              return new RecordActions.DeleteRecordConfirm(responseData.deleted_record);
            }),
            catchError(error => {
              console.log(error);
              return of({type: "Dummy_action"});
            })
          );
      }));
  });


  redirectOnSave = createEffect(() =>
      this.action$.pipe(
        ofType(RecordActions.SET_RECORDS),
        tap((actionResp: RecordActions.SetRecords) => {
          if (actionResp.payload.recordsFailedResponse) {
            let date = actionResp.payload.recordsFailedResponse.date;
            let weeks = get_weeks();
            const week = weeks.find((week: Week) => is_date_in_range(date, week.start_date, week.end_date));
            if (week) {
              this.router.navigate(["planowanie/" + week.id + "/" + date + "/wybierz-szkoly"]);
            }
          } else if (actionResp.payload.records.length !== 0) {
            const week_id = actionResp.payload.records[0].week_id;
            this.router.navigate(["planowanie/" + week_id]);
          } else {
            this.router.navigate(["planowanie"]);
          }
        })),
    {dispatch: false});


  constructor(private action$: Actions,
              private http: HttpClient,
              private router: Router) {
  }
}


