import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {map, take} from "rxjs/operators";
import {RoleUtils} from "../shared/namemapping.utils";
import {Store} from "@ngrx/store";
import * as fromApp from "../store/app.reducer"

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private store: Store<fromApp.AppState>) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> | UrlTree {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => {
        return authState.user;
      }),
      map(user => {
        const isAuth = !!user;
        if (isAuth) return true;
        return this.router.createUrlTree(["/logowanie"]);
      }));
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthGuardForLogin implements CanActivate {

  constructor(private router: Router, private store: Store<fromApp.AppState>) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> | UrlTree {
    let user;
    this.store.select('auth').subscribe(authState => {
      user = authState.user;
    });
    if (!user) {
      return true;
    }
    return this.router.createUrlTree(["/"]);
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router, private store: Store<fromApp.AppState>) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> | UrlTree {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => {
        return authState.user;
      }),
      map(user => {
        const isAuth = !!user;
        if (isAuth && RoleUtils.isAdmin(user)) return true;
        return this.router.createUrlTree(["/"]);
      }));
  }
}

@Injectable({
  providedIn: 'root'
})
export class ProgramSelectedGuard implements CanActivate {
 constructor(private router: Router, private store: Store<fromApp.AppState>) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> | UrlTree {
    return this.store.select('programs').pipe(
      take(1),
      map(programState => {
        if (programState.indexOfSelectedProgram === -1)
          return this.router.createUrlTree(["/"]);
        return true;
      }));
  }
}
