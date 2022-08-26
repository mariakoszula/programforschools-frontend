import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserDisplayComponent} from './user-display/user-display.component';
import {RouterModule} from "@angular/router";
import {UsersComponent} from "./users.component";
import {AdminGuard, AuthGuard} from "../auth/authguard.service";
import {AddUserComponent} from "./adduser/adduser.component";
import {UsersManagementComponent} from "./users-management.component";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";


@NgModule({
  declarations: [
    UsersComponent,
    UserDisplayComponent,
    AddUserComponent,
    UsersManagementComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        canActivate: [AuthGuard],
        component: UsersManagementComponent,
        children: [
          {path: '', component: UsersComponent},
          {path: 'nowy', component: AddUserComponent, canActivate: [AdminGuard]}
        ]
      },
    ]),
    ReactiveFormsModule,
    SharedModule
  ]
})
export class UserManagementModule {
}
