import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";
import {Role, RoleUtils} from "../../shared/namemapping.utils";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AddUserComponent implements OnInit {
  registerForm: FormGroup;
  error: string = "";
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {
    this.registerForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required,  Validators.minLength(8)]),
      role: new FormControl(null, [Validators.required]),
    });
  }

  get roles() {
    return [RoleUtils.roles_names[Role.Program], RoleUtils.roles_names[Role.Finance]];
  }
  ngOnInit(): void {
  }

  onAddUser() {
    if (!this.registerForm)
      return;
    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;
    const username = this.registerForm.value.username;
    const role = this.registerForm.value.role;
    this.isLoading = true;
    this.authService.register(email, password,
      username, RoleUtils.toEnum(role)).subscribe({
        next: response => {
          this.isLoading = false;
          this.router.navigate(['/uzytkownicy']);
        },
      error: errorResponse => {
          this.isLoading = false;
          this.error = errorResponse;
      }
      }
    );
  }
}
