import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {get_current_program} from "../../shared/common.functions";

@Component({
  selector: 'app-select-app-type',
  templateUrl: './select-app-type.component.html',
})
export class SelectAppTypeComponent implements OnInit{
  availableAppTypes: string[] = [];
  constructor(private router: Router, private http: HttpClient){

  }

  ngOnInit() {
    this.http.get<{ app_type: string[] }>(environment.backendUrl + "/application/type?program_id=" + get_current_program().id).subscribe(resp => {
      this.availableAppTypes = resp.app_type;
    })
  }
  selectAppType($event: any) {
    this.router.navigate(['dokumenty/wnioski/nowy_wniosek/' + $event.target.value]);
  }

}
