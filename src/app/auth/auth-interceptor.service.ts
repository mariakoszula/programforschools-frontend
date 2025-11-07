import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from "@angular/common/http";
import {catchError, Observable, switchMap, throwError} from "rxjs";
import {AuthService} from "./auth.service";
import {exhaustMap, map, take} from "rxjs/operators";
import {User} from "./user.model";
import {Store} from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import {Router} from "@angular/router";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  private isTokenRefreshing = false;

  constructor(private authService: AuthService,
              private store: Store<fromApp.AppState>,
              private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select('auth').pipe(take(1),
      map(authState => {
        return authState.user;
      }),
      exhaustMap(user => {
        if (!user || req.url.includes("refresh") || req.url.includes("login") || req.url.includes("logout")) {
          return next.handle(req);
        }

        return next.handle(this.requestWithTokenInHeader(req, user)).pipe(catchError(error => {
          // Handle 401 Unauthorized - logout automatically
          if (error.status === 401) {
            return this.handle401(error);
          }

          // Original token refresh logic
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

  // NEW: Handle 401 Unauthorized responses
  private handle401(error: HttpErrorResponse): Observable<never> {
    console.warn('401 Unauthorized - Session expired - Auto logout');

    // Clear authentication state
    this.authService.logout();

    // Redirect to login
    this.router.navigate(['/login']);

    // Show error message (optional)
    alert('Your session has expired. Please login again.');

    return throwError(() => error);
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
