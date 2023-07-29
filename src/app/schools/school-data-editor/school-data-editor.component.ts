import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {School} from "../school.model";
import {Store} from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import {ActivatedRoute, Params} from "@angular/router";
import * as SchoolActions from "../store/schools.action"
import {Subscription} from "rxjs";

@Component({
  selector: 'app-school-data-editor',
  templateUrl: './school-data-editor.component.html',
})
export class SchoolDataEditorComponent implements OnInit, OnDestroy {
  schoolForm: FormGroup;
  isLoading: boolean;
  id: number = -1;
  editSchool: School | null | undefined = null;
  paramsSub: Subscription | null = null;
  editSchoolSub: Subscription | null = null;

  constructor(private store: Store<fromApp.AppState>,
              private activeRoute: ActivatedRoute) {
    this.isLoading = false;
    this.schoolForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.paramsSub = this.activeRoute.params.subscribe(
      (params: Params) => {
        if (params["id"])
          this.id = +params["id"];
      });
    this.editSchoolSub = this.store.select("school").subscribe(schoolState => {
      if (this.id !== -1) {
        this.editSchool = schoolState.schools.find((_school: School, index) => {
        return _school.id === this.id;
      });
      } else {
        this.id = -1;
        this.editSchool = null;
      }
    });
    this.initForm();
  }

  private initForm() {
    let nick = null;
    let name = null;
    let address = null;
    let regon = null;
    let nip = null;
    let email = null;
    let phone = null;
    let city = null;
    let responsible_person = null;
    let representative = null;
    let representative_nip = null;
    let representative_regon = null;
    if (this.editSchool) {
      nick = this.editSchool.nick;
      name = this.editSchool.name;
      address = this.editSchool.address;
      regon = this.editSchool.regon;
      nip = this.editSchool.nip;
      email = this.editSchool.email;
      phone = this.editSchool.phone;
      city = this.editSchool.city;
      responsible_person = this.editSchool.responsible_person;
      representative = this.editSchool.representative;
      representative_nip = this.editSchool.representative_nip;
      representative_regon = this.editSchool.representative_regon;
      this.schoolForm.addControl("nick", new FormControl({
        value: nick, disabled: true
      }, []));

    }
    this.schoolForm.addControl("nick", new FormControl(nick, [Validators.required]));
    this.schoolForm.addControl("name", new FormControl(name, []));
    this.schoolForm.addControl("address", new FormControl(address, []));
    this.schoolForm.addControl("regon", new FormControl(regon, []));
    this.schoolForm.addControl("nip", new FormControl(nip, []));
    this.schoolForm.addControl("email", new FormControl(email, [Validators.email]));
    this.schoolForm.addControl("phone", new FormControl(phone, []));
    this.schoolForm.addControl("city", new FormControl(city, []));
    this.schoolForm.addControl("responsible_person", new FormControl(responsible_person, []));
    this.schoolForm.addControl("representative", new FormControl(representative, []));
    this.schoolForm.addControl("representative_nip", new FormControl(representative_nip, []));
    this.schoolForm.addControl("representative_regon", new FormControl(representative_regon, []));
  }

  onSubmitSchool() {
    let formValues = this.schoolForm.getRawValue();
    if (!this.editSchool) {
      this.store.dispatch(new SchoolActions.Add(formValues));
    } else {
      this.store.dispatch(new SchoolActions.Update(formValues, this.editSchool.id));
    }
  }

  ngOnDestroy(): void {
    if (this.paramsSub) this.paramsSub.unsubscribe();
    if (this.editSchoolSub) this.editSchoolSub.unsubscribe();
  }

}
