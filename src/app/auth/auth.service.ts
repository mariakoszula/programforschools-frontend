import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpStatusCode} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BehaviorSubject, tap, throwError} from "rxjs";
import {User, UserInterface} from "./user.model";
import {Router} from "@angular/router";
import {Role, RoleUtils, CommonResponse} from "../shared/namemapping.utils";
import * as fromApp from "../store/app.reducer"
import * as AuthActions from "./store/auth.actions";
import {Store} from "@ngrx/store";

export interface AuthResponseData {
  id: string,
  access_token: string;
  refresh_token: string;
}

export interface UserResponseData {
  id: string,
  email: string,
  username: string,
  role: string
}

export interface UsersResponseData {
  users: string[];
}

export interface RefreshResponseData {
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>) {
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      environment.backendUrl + '/login',
      {
        email: email,
        password: password
      }
    ).pipe(tap(respData => {
      this.onAuthentication(email, respData.id, respData.access_token, respData.refresh_token);
    }));
  }

  private onAuthentication(email: string, ueId: string, accessToken: string, refreshToken: string) {
    this.store.dispatch(new AuthActions.Login({
      email: email, id: ueId, access_token: accessToken, refresh_token: refreshToken
    }));
    this.userData(+ueId).subscribe({
      next: (response) => {
        let user_updated = this.user.getValue();
        if (!user_updated || response.email !== user_updated?.email) {
          this.logout();
          if (user_updated)
            console.log("Inconsistent data received from server for user: " + user_updated?.email);
          else
            console.log("Inconsistent data user does not exists");
        } else {
          this.store.dispatch(new AuthActions.Update({ username: response.username, role: response.role }));
          localStorage.setItem("userData", JSON.stringify(user_updated));
        }
      },
      error: (errorResponse) => {
        console.log(errorResponse);
        this.logout();
      }
    });

  }

  userData(id: number) {
    return this.http.get<UserResponseData>(
      environment.backendUrl + "/user/" + id
    );
  }

  register(email: string, password: string, username: string, role: Role) {
    return this.http.post<string>(
      environment.backendUrl + "/register",
      {
        email: email,
        password: password,
        username: username,
        role: RoleUtils.frontendRoleToBackend(role)
      });
  }

  deleteUser(user_id: number) {
    return this.http.delete<CommonResponse>(
      environment.backendUrl + "/user/" + user_id
    );
  }

  users(current_user_id: number): User[] {
    let users: User[] = [];
    this.http.get<UsersResponseData>(
      environment.backendUrl + '/users'
    ).subscribe({
      next: response => {
        for (let i of response.users) {
          let user_id = +i;
          if (user_id !== current_user_id) {
            this.userData(user_id).subscribe({
              next: (resp) => {
                const _role = RoleUtils.backendRoleToFrontend(resp.role);
                users.push(new User(resp.email, user_id, "", "", resp.username, _role));
              },
              error: (error) => {
                console.log(error);
              }
            })
          }
        }
      },
      error: errorMsg => {
        console.log(errorMsg);
      }
    });
    return users;
  }

  handleError(errorResp: HttpErrorResponse): string {
    console.log(errorResp);
    let errorMessage = 'Wystąpił nieznany błąd!';
    switch (errorResp.status) {
      case HttpStatusCode.Unauthorized:
        errorMessage = 'Podane dane do logowania są nieprawidłowe';
        break;
    }
    return errorMessage;
  }

  private removeToken(token: string) {
    this.http.delete(environment.backendUrl + "/logout",
      {
        headers: AuthService.createAuthorizationHeader(token)
      }).subscribe();
  }


  logout() {
    let user = this.user.getValue();
    if (user) {
      this.removeToken(user.refresh_token);
      this.removeToken(user.access_token);
    }
    this.store.dispatch(new AuthActions.Logout());
    this.router.navigate(['/logowanie']);
    localStorage.removeItem("userData");
  }

  autoLogin() {
    const userDataJson = localStorage.getItem("userData");
    if (!userDataJson)
      return;
    const userData: UserInterface = JSON.parse(userDataJson);
    this.store.dispatch(new AuthActions.AutoLogin({
      email: userData.email, id: userData.id, access_token: userData.access_token, refresh_token: userData.refresh_token,
      username: userData.username, role: userData.role
    }));
  }

  refresh() {
    let user = this.user.getValue();
    if (!user) {
      return;
    }
    return this.http.post<RefreshResponseData>(
      environment.backendUrl + "/refresh",
      null,
      {
        headers: AuthService.createAuthorizationHeader(user.refresh_token)
      }).pipe(tap(
      response => {
        if (user) {
          this.store.dispatch(new AuthActions.RefreshToken({access_token: response.access_token}));
          localStorage.setItem("userData", JSON.stringify(user));
        }
      }
    ));
  }

  static authorizationToken(token: string) {
    return 'Bearer ' + token;
  }

  static createAuthorizationHeader(token: string) {
    let header = new HttpHeaders({
      "Authorization": AuthService.authorizationToken(token)
    });
    return header;
  }
}
