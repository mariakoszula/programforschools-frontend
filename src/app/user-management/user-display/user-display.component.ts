import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {User} from "../../auth/user.model";
import {RoleUtils} from "../../shared/namemapping.utils";
import {AuthService} from "../../auth/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-user-display',
  templateUrl: './user-display.component.html',
  styleUrls: ['./user-display.component.css']
})
export class UserDisplayComponent implements OnInit, OnDestroy {
  @Output() userChange = new EventEmitter<string>();
  @Input() isAdmin: boolean = false;
  @Input() user!: User;
  private deleteUserSub: Subscription | undefined;

  get userRole() {
    return RoleUtils.roles_names[this.user.role];
  }

  get userIcon() {
    return RoleUtils.getIconName(this.user.role);
  }

  constructor(private authService: AuthService) {
  }

  ngOnDestroy(): void {
    if (this.deleteUserSub) {
      this.deleteUserSub.unsubscribe();
    }
  }

  ngOnInit(): void {
  }

  onDeleteUser() {
    this.deleteUserSub = this.authService.deleteUser(this.user.id).subscribe(
      response => {
        this.userChange.emit("Użytkownik " + this.user.username + " został usunięty");
      });
  }

}
