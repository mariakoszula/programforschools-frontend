import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, of, switchMap} from "rxjs";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import * as CompanyActions from "../store/company.action";
import {CompanyResponse} from "../store/company.action";
import {Injectable} from "@angular/core";
import {MAIN_COMPANY} from "../company.model";

export interface CompaniesResponseData {
  companies: CompanyResponse[]
}

@Injectable()
export class CompanyEffects {
  onFetch$ = createEffect(() => {
    return this.action$.pipe(
      ofType(CompanyActions.FETCH),
      switchMap((fetchAction: CompanyActions.Fetch) => {
        return this.http.get<CompaniesResponseData>(environment.backendUrl + '/company/all')
          .pipe(
            map(responseData => {
              if (responseData.companies.length > 0) {
                return new CompanyActions.Set({...responseData.companies[MAIN_COMPANY]});
              }
              return {type: "No companies found"};
            }),
          );
      }));

  });

  constructor(private action$: Actions, private http: HttpClient) {
  }
}
