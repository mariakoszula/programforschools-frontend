import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {tap} from "rxjs";

export interface AuthResponseData {
  id: string,
  accessToken: string;
  refreshToken: string;
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

  constructor(private http: HttpClient) {
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      environment.backendUrl + '/login',
      {
        email: email,
        password: password
      }
    ).pipe(tap(respData => {
      this.onAuthentication(email, +respData.id, respData.accessToken, respData.refreshToken);
    }));
  }

  private onAuthentication(email: string, ueId: number, accessToken: string, refreshToken: string) {
    this.userData(ueId, accessToken).subscribe({
      next: () => {
      },
      error: () => {

      }
    });
  }
  // TODO use interceptor to be able to send Bearer na jwt_token
  // TODO try to refresh on first UNAUTHORIZED access
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
}
