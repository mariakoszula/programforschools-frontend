import {environment} from "../../environments/environment"
import {User} from "../auth/user.model";

export enum Role {
  Undefined,
  Admin,
  Program
}

export class RoleUtils {
  public static getIconName(role?: Role) {
    let icon = "apples.PNG";
    if (role === undefined) {
      return icon;
    }
    switch (role) {
      case Role.Admin:
        icon = "admin.png";
        break;
      case Role.Program:
        icon = "program_manager.png";
        break;
    }
    return icon;
  }

  public static getProgramTitle(role?: Role) {
    let title = environment.mainProgramName;
    if (role === undefined) {
      return title;
    }
    switch (role) {
      case Role.Admin:
        title = "AdminPanel";
        break;
      case Role.Program:
        title = "Program dla szkół";
        break;
    }
    return title;
  }

  public static getStringFromRole(role: Role) {
    let str_role = ""
    switch (role) {
      case Role.Admin:
        str_role = "Administrator";
        break;
      case Role.Program:
        str_role = "Manager programu do szkół";
        break;
    }
    return str_role;
  }

  public static getRoleFromString(role: string) {
    let converted_role = Role.Undefined;
    switch (role) {
      case "admin":
        converted_role = Role.Admin;
        break;
    }
    return converted_role;
  }
  public static isAdmin(user: User) {
    return user.role === Role.Admin;
  }
}
