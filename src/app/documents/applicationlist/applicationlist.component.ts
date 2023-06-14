import {Component, OnInit} from '@angular/core';
import {Application, Contract} from "../contract.model";
import {AppState} from "../../store/app.reducer";
import {Store} from "@ngrx/store";
import {State} from "../store/documents.reducer";
import {Week} from "../../programs/program.model";
import {School} from "../../schools/school.model";

@Component({
  selector: 'app-applicationlist',
  templateUrl: './applicationlist.component.html'
})
export class ApplicationListComponent implements OnInit {
    applications: Application[] = [];
    errors: { [no: number]: string } = {};
    dtOptions: DataTables.Settings = {};

    constructor(private store: Store<AppState>) {
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
                console.log(this.applications);
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

}
