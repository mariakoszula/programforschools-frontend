import {Component, OnInit} from '@angular/core';
import {Application, Contract} from "../contract.model";
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";
import {State} from "../store/documents.reducer";
import {School} from "../../schools/school.model";
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";



interface Error {
  message: string;
  school: string;
  type: string;
}
interface CheckErrorResponse {
  application: Application;
  errors: Error[]
}
@Component({
  selector: 'app-applicationlist',
  templateUrl: './applicationlist.component.html'
})
export class ApplicationListComponent implements OnInit {
    applications: Application[] = [];
    errors: { [no: string]: Error[] } = {};
    dtOptions: DataTables.Settings = {};

    constructor(private store: Store<AppState>, private http: HttpClient) {
    this.dtOptions = {
      order: [[1, 'asc']],
      responsive: false,
      searching: false,
      language: {"url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Polish.json"},
    };
    }
    ngOnInit(){
      this.store.select("document").subscribe((state: State) => {
        this.applications = state.applications;
        for (let app of this.applications){
          this.http.get<CheckErrorResponse>(environment.backendUrl + "/validate_application/" + app.id).subscribe(
            resp => {
              if (resp.errors.length !== 0){
                this.errors[app.no] = resp.errors;
              }
            }
          )
        }
      });

    }
    onEditApplication(application: Application) {
      console.log("Edit schools add/remove or weeks add/remove: " + application.id);
    }

    public get_schools(contracts: Contract[]){
      let schools: School[] = [];
      for (let contract of contracts){
        schools.push(contract.school);
      }
      return schools;
    }
    public has_no_errors(application_no: number){
      return !(application_no in this.errors);
    }

    public get_errors(): string[]{
      return Object.keys(this.errors);
    }

    public error_message(error: Error){
      let val = error.school;
      val += "\n";
      val += error.message;
      return val;
    }
}
