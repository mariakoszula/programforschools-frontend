import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "../auth/store/auth.actions"

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  authForm: FormGroup;
  isLoading = false;
  error: string = "";

  constructor(private auth: AuthService, private router: Router, private store: Store<fromApp.AppState>) {
    this.authForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    })
  }

  ngOnInit(): void {
    this.store.select('auth').subscribe(authState => {
        this.isLoading = authState.isLoading;
        if ( authState.authError) {
          this.error = authState.authError;
        }
      }
    )
  }

  onSubmit() {
    if (!this.authForm.valid) {
      return;
    }
    const email = this.authForm.value.email;
    const password = this.authForm.value.password;
    this.store.dispatch(new AuthActions.LoginBegin({
      email: email,
      password: password
    }));
  }
}
