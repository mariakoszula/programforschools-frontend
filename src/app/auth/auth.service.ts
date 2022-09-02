import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, } from "@angular/common/http";
import {environment} from "../../environments/environment";
import {tap} from "rxjs";
import {User, UserInterface} from "./user.model";
import {Router} from "@angular/router";
import {Role, RoleUtils, CommonResponse} from "../shared/namemapping.utils";
import * as fromApp from "../store/app.reducer"
import * as AuthActions from "./store/auth.actions";
import {Store} from "@ngrx/store";


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

  constructor(private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>) {
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

  users(current_user_id: number):
    User[] {
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


  removeToken(token: string) {
    this.http.delete(environment.backendUrl + "/logout",
      {
        headers: AuthService.createAuthorizationHeader(token)
      }).subscribe();
  }


  refresh() {
    const userDataJson = localStorage.getItem("userData");
    if (!userDataJson)
      return;
    const userData: UserInterface = JSON.parse(userDataJson);
    return this.http.post<RefreshResponseData>(
      environment.backendUrl + "/refresh",
      null,
      {
        headers: AuthService.createAuthorizationHeader(userData.refresh_token)
      }).pipe(tap(
      response => {
        let user = new User(userData.email, +userData.id, response.access_token, userData.refresh_token, userData.username, userData.role);
        this.store.dispatch(new AuthActions.RefreshToken({access_token: response.access_token}));
        localStorage.setItem("userData", JSON.stringify(user));
      }));
  }

  static authorizationToken(token: string) {
    return 'Bearer ' + token;
  }

  static createAuthorizationHeader(token: string ) {
    let header = new HttpHeaders({
      "Authorization": AuthService.authorizationToken(token)
    });
    return header;
  }
}
