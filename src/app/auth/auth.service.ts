import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BehaviorSubject, tap, throwError} from "rxjs";
import {User} from "./user.model";
import {Router} from "@angular/router";
import {Role, RoleUtils} from "../shared/namemapping.utils";

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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      environment.backendUrl + '/login',
      {
        email: email,
        password: password
      }
    ).pipe(tap(respData => {
      this.onAuthentication(email, +respData.id, respData.access_token, respData.refresh_token);
    }));
  }

  private onAuthentication(email: string, ueId: number, accessToken: string, refreshToken: string) {
    const current_user = new User(email, ueId, accessToken, refreshToken);
    this.user.next(current_user);
    this.userData(ueId, accessToken).subscribe({
      next: (response) => {
        let user_updated = this.user.getValue();
        if (!user_updated || response.email !== user_updated?.email) {
          this.logout();
          if (user_updated)
            console.log("Inconsistent data received from server for user: " + user_updated?.email);
          else
            console.log("Inconsistent data user does not exists");
        } else {
          user_updated.username = response.username;
          user_updated.role = RoleUtils.getRoleFromString(response.role);
          this.user.next(user_updated);
          localStorage.setItem("userData", JSON.stringify(user_updated));
        }
      },
      error: (errorResponse) => {
        console.log(errorResponse);
        this.logout();
      }
    });

  }

  userData(id: number, token: string) {
    return this.http.get<UserResponseData>(
      environment.backendUrl + "/user/" + id
    );
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

  logout() {
    this.user.next(null);
    this.router.navigate(['/logowanie']);
    localStorage.removeItem("userData");
    // TODO logout refresh_token and access_token
  }

  autoLogin() {
    const userDataJson = localStorage.getItem("userData");
    if (!userDataJson)
      return;
    let userData: { email: string; id: string; access_token: string; refresh_token: string; username: string; role: Role };
    userData = JSON.parse(userDataJson);
    this.user.next(new User(userData.email, +userData.id, userData.access_token, userData.refresh_token, userData.username, userData.role));
  }

}
