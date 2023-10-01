import {Component, OnInit} from '@angular/core';
import {Application, Contract} from "../contract.model";
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";
import {State} from "../store/documents.reducer";
import {School} from "../../schools/school.model";
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {GenerateApplications} from "../store/documents.action";
import {Router} from "@angular/router";


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
    applicationForm: FormGroup;

    constructor(private store: Store<AppState>, private http: HttpClient, private router: Router) {
      this.applicationForm = new FormGroup<any>({
          'app_date': new FormControl("", [Validators.required]),
          'is_last': new FormControl(),
          'start_week': new FormControl(1, [Validators.required, Validators.min(1), Validators.max(14)])
      });
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
      this.router.navigate(["dokumenty/wnioski/" + application.id + "/edycja"]);
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
      val += ":";
      if (error.type === "WeekInconsistencyError") {
        val += "Brak produktów w tygodniu.";
      }
      else if (error.type === "KidsInconsistencyError") {
        val += "Liczba dzieci na WZ nie zgadza się z umową lub aneksem.";
      }
      else if (error.type === "StateInconsistencyError") {
        val += "Nie zatwierdzono WZ.";
      }
      val += "\n";
      val += error.message;
      return val;
    }

    public onGenerateApplication(application: Application) {
      let _is_last: boolean = false;
      if (this.applicationForm.value.is_last) {
        _is_last = true;
      }
      this.store.dispatch(new GenerateApplications({
        id: application.id,
        no: application.no,
        app_date: this.applicationForm.value.app_date,
        is_last: _is_last,
        start_week: this.applicationForm.value.start_week
      }));
      this.applicationForm.reset();
    }

    public addApplication() {
       this.router.navigate(['dokumenty/wnioski/nowy_wniosek/wybor-typu']);
    }
}
