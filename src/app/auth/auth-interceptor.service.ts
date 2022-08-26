import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from "@angular/common/http";
import {catchError, Observable, Subscription, switchMap, throwError} from "rxjs";
import {AuthService} from "./auth.service";
import {exhaustMap, take} from "rxjs/operators";
import {User} from "./user.model";

@Injectable()

export class AuthInterceptorService implements HttpInterceptor {
  private isTokenRefreshing = false;
  refreshTokenSub: Subscription | undefined;

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(take(1), exhaustMap(user => {
      if (!user || req.url.includes("refresh") || req.url.includes("login") || req.url.includes("logout")) {
        return next.handle(req);
      }

      return next.handle(this.requestWithTokenInHeader(req, user)).pipe(catchError(error => {
        if (!this.refreshRequired(error)) {
          return throwError(() => error);
        }
        let refreshCommand = this.authService.refresh();
        if (!refreshCommand) {
          return throwError(() => error);
        }
        if (!this.isTokenRefreshing) {
          this.isTokenRefreshing = true;
          return refreshCommand.pipe(switchMap(resp => {
            this.isTokenRefreshing = false;
            return next.handle(this.requestWithTokenInHeader(req, user));
          }));
        }
        return throwError(() => error);
      }));
    }));
  }


  private refreshRequired(errorResp: HttpErrorResponse) {
    return errorResp.status === HttpStatusCode.Unauthorized &&
      errorResp.error.msg === 'Token has expired';
  }

  private requestWithTokenInHeader(req: HttpRequest<any>, user: User) {
    const modifiedReq = req.clone({
        setHeaders: {
          Authorization: AuthService.authorizationToken(user.access_token)
        }
      });
    return modifiedReq;
  }
}


