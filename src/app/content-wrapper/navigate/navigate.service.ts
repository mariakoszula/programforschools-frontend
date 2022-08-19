import { Injectable } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";

const itemNotInHistory = -1;
export class NavigationHistory {
  public pathShort: string;
  constructor(public exactPath: string) {
    this.pathShort = this.preparePathName();
  }
  preparePathName(): string
  {
    if (this.exactPath == "/") return "Strona Główna";
    else
      return this.exactPath.charAt(1).toUpperCase() + this.exactPath.substring(2);
  }
}

@Injectable({
  providedIn: 'root'
})
export class NavigateService {
  navigationHistory: NavigationHistory[]  = [];
  constructor(private router: Router) {
  }
  private indexInHistory(url: string): number {
    for(let i = 0; i < this.navigationHistory.length; i++)  {
      if (this.navigationHistory[i].exactPath === url) return i;
    }
    return itemNotInHistory;
  }
  public saveHistory(): void {
    this.router.events.subscribe({
      next: (event) => {
        if (event instanceof NavigationEnd) {
          const indexInHistory = this.indexInHistory(event.urlAfterRedirects);
          if (indexInHistory === itemNotInHistory){
            this.navigationHistory.push(new NavigationHistory(event.urlAfterRedirects));
          } else {
            this.navigationHistory.length = indexInHistory + 1;
          }
        }
      }
    });
  }
}
