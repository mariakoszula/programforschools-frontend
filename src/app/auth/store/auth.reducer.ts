import {User} from "../user.model";
import {AuthActions, AUTO_LOGIN, LOGIN, LOGOUT, REFRESH_TOKEN, UPDATE} from "./auth.actions";
import {RoleUtils} from "../../shared/namemapping.utils";

export interface State {
  user: User | null;
}

const initialState: State = {
  user: null
};


export function authReducer(state = initialState, action: AuthActions): State {
  switch (action.type) {
    case LOGIN:
      const user = new User(
        action.userPayload.email,
        +action.userPayload.id,
        action.userPayload.access_token,
        action.userPayload.refresh_token);
      return {
        user: user
      };
    case LOGOUT:
      return {
        user: null
      };
    case AUTO_LOGIN:
      const autoUser = new User(
        action.userPayload.email,
        +action.userPayload.id,
        action.userPayload.access_token,
        action.userPayload.refresh_token,
        action.userPayload.username,
        action.userPayload.role);
      return {
        ...state,
        user: autoUser
      };
    case REFRESH_TOKEN:
      let user_with_token_refreshed: User | null = state.user;
      if (user_with_token_refreshed)
        user_with_token_refreshed.access_token = action.userPayload.access_token;
      return {
        ...state,
        user: user_with_token_refreshed
      };
    case UPDATE:
      let updated_user: User | null = state.user;
      if (updated_user) {
        updated_user.username = action.userPayload.username;
        updated_user.role = RoleUtils.backendRoleToFrontend((action.userPayload.role));
        localStorage.setItem("userData", JSON.stringify(updated_user));
      }
      return {
        ...state,
        user: updated_user
      };
    default:
      return state;
  }
}
