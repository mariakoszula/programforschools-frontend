import { environment } from "../../environments/environment"

export enum Role {
  Admin,
  Program
}

export class RoleUtils {
  public static getIconName(role?: Role) {
    let icon = "apples.PNG";
    if (role === undefined) {
      return icon;
    }
    switch(role) {
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
    switch(role) {
      case Role.Admin:
        title = "Administrator";
        break;
      case Role.Program:
        title = "Program dla szkół";
        break;
    }
    return title;
  }
}
