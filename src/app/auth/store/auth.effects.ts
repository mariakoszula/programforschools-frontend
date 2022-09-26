import {Actions, createEffect, Effect, ofType} from "@ngrx/effects";
import * as  AuthActions from "./auth.actions";
import {catchError, of, switchMap, tap, withLatestFrom} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {UserInterface} from "../user.model";
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";

export interface AuthResponseData {
  id: string,
  access_token: string;
  refresh_token: string;
}

const handleAuthenticationBegin = (email: string, userId: string, accessToken: string, refreshToken: string) => {
  return new AuthActions.LoginInProgress({
    email: email,
    id: userId,
    access_token: accessToken,
    refresh_token: refreshToken
  });
}


const handleError = (errorResp: HttpErrorResponse) => {
  let errorMessage = 'Wystąpił nieznany błąd!';
  switch (errorResp.status) {
    case HttpStatusCode.Unauthorized:
      errorMessage = 'Podane dane do logowania są nieprawidłowe';
      break;
    default:
      console.log(errorResp);
  }
  return of(new AuthActions.AuthError((errorMessage)));
}

@Injectable()
export class AuthEffects {

  logInBegin$ = createEffect(() => {
    return this.action$.pipe(
      ofType(AuthActions.LOGIN_BEGIN),
      switchMap((authData: AuthActions.LoginBegin) => {
        return this.http.post<AuthResponseData>(
          environment.backendUrl + '/login',
          {
            email: authData.payload.email,
            password: authData.payload.password
          }).pipe(
          map((respData: any) => {
            return handleAuthenticationBegin(respData.email, respData.id, respData.access_token, respData.refresh_token);
          }),
          catchError(error => handleError(error))
        );
      }));
  });

  logInProgress$ = createEffect(() => {
    return this.action$.pipe(
      ofType(AuthActions.LOGIN_IN_PROGRESS),
      switchMap((authData: AuthActions.LoginInProgress) => {
        return this.authService.userData(+authData.payload.id).pipe(
          map((respData: any) => {
            return new AuthActions.LoginSuccess({username: respData.username, role: respData.role});
          }),
          catchError(error => handleError(error))
        );
      }));
  });


  authRedirectAndSaveData = createEffect(() => this.action$.pipe(
      ofType(AuthActions.LOGIN_SUCCESS),
      withLatestFrom(this.store$),
      tap(([_, state]) => {
        localStorage.setItem("userData", JSON.stringify(state.auth.user));
        this.router.navigate(["/"]);

      })),
    {dispatch: false}
  );

  authLogout = createEffect(() => this.action$.pipe(
      ofType(AuthActions.LOGOUT),
      tap(() => {
        const userDataJson = localStorage.getItem("userData");
        if (userDataJson) {
          const userData: UserInterface = JSON.parse(userDataJson);
          this.authService.removeToken(userData.refresh_token);
          this.authService.removeToken(userData.access_token);
          localStorage.removeItem("userData");
          localStorage.removeItem("currentProgram");
          localStorage.removeItem("currentWeeks");
          localStorage.removeItem("currentDiaryProducts");
          localStorage.removeItem("currentFruitVegProducts");
          localStorage.removeItem("refresh");
          this.router.navigate(['/logowanie']);
        }
      })),
    {dispatch: false}
  );

  authAutoLogin$ = createEffect(() => this.action$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userDataJson = localStorage.getItem("userData");
      if (!userDataJson) {
        return {type: "Dummy_action"};
      }
      const userData: UserInterface = JSON.parse(userDataJson);
      return new AuthActions.AutoLoginFinish({
        email: userData.email,
        id: userData.id,
        access_token: userData.access_token,
        refresh_token: userData.refresh_token,
        username: userData.username,
        role: userData.role
      })
    })));

  constructor(private action$: Actions, private http: HttpClient, private router: Router,
              private store$: Store<AppState>,
              private authService: AuthService) {
  }
}
