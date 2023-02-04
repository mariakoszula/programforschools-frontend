import {environment} from "../../environments/environment"
import {User} from "../auth/user.model";

export enum Role {
  Admin,
  Program,
  Finance,
  Undefined
}

export interface CommonResponse{
  message: string;
}

export const DayColors = [
  '#4CAF50',
  '#DC3DB2',
  '#008CBA',
  '#f44336',
  '#EAEA26'
]


export const FRUIT_VEG_PRODUCT = "owoce-warzywa";
export const DAIRY_PRODUCT = "nabiał";


export class RoleUtils {
  public static roles_names: string[] =  [
    "Admin Panel",
    "Program dla szkół",
    "Zarządzanie finansami",
    environment.mainProgramName
  ];

  public static getIconName(role?: Role) {
    let icon = "apples.PNG";
    if (role === undefined) {
      return icon;
    }
    icon = RoleUtils.frontendRoleToBackend(role) + ".png";
    return icon;
  }

  public static getProgramTitle(role?: Role) {
    let title = environment.mainProgramName;
    if (role === undefined) {
      return title;
    }
    title = RoleUtils.roles_names[role];
    return title;
  }

  public static frontendRoleToBackend(role: Role) {
    let str_role = ""
    switch (role) {
      case Role.Admin:
        str_role = "admin";
        break;
      case Role.Program:
        str_role = "program_manager";
        break;
      case Role.Finance:
        str_role = "finance_manager";
        break;
    }
    return str_role;
  }

  public static backendRoleToFrontend(role: string) {
    let converted_role = Role.Undefined;
    switch (role) {
      case "admin":
        converted_role = Role.Admin;
        break;
      case "program_manager":
        converted_role = Role.Program;
        break;
      case "finance_manager":
        converted_role = Role.Finance;
        break;
    }
    return converted_role;
  }

  public static toEnum(role:string) {
    return RoleUtils.roles_names.indexOf(role);
  }
  public static isAdmin(user: User) {
    return user.role === Role.Admin;
  }
}
