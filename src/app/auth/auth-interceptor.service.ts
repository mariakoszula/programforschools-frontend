import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
  HttpStatusCode,
} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";
import {AuthService} from "./auth.service";
import {exhaustMap, take} from "rxjs/operators";

@Injectable()

export class AuthInterceptorService implements HttpInterceptor {
  private refreshingToken = false;

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(take(1), exhaustMap(user => {
      if (!user) {
        return next.handle(req);
      }
      const modifiedReq = req.clone({
          setHeaders: {
            Authorization: 'Bearer ' + user.access_token
          }
        }
      );
      return next.handle(modifiedReq).pipe(catchError(this.handleRefreshToken.bind(this)));
    }));
  }

  private handleRefreshToken(errorResp: HttpErrorResponse) {
    console.log(this.refreshingToken);
    if (errorResp.status !== HttpStatusCode.Unauthorized) {
      return throwError(() => errorResp);
    }

    return throwError(() => errorResp);
  }
}
