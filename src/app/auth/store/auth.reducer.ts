import {User} from "../user.model";
import {
  AUTH_ERROR,
  AuthActions,
  AUTO_LOGIN,
  AUTO_LOGIN_FINISH,
  LOGIN_BEGIN,
  LOGIN_IN_PROGRESS,
  LOGIN_SUCCESS,
  LOGOUT,
  REFRESH_TOKEN
} from "./auth.actions";
import {RoleUtils} from "../../shared/namemapping.utils";

export interface State {
  user: User | null;
  authError: string | null;
  isLoading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  isLoading: false
};


export function authReducer(state = initialState, action: AuthActions): State {
  switch (action.type) {
    case LOGIN_BEGIN:
      return {
        ...state,
        user: null,
        authError: null,
        isLoading: true
      };
    case LOGIN_IN_PROGRESS:
      const user = new User(
        action.payload.email,
        +action.payload.id,
        action.payload.access_token,
        action.payload.refresh_token);
      return {
        user: user,
        authError: null,
        isLoading: true
      };
    case LOGIN_SUCCESS:
      let updated_user: User | null = null;
      if (state.user) {
        updated_user = {
          ...state.user,
          username: action.payload.username,
          role: RoleUtils.backendRoleToFrontend((action.payload.role))
        };
      }
      return {
        ...state,
        user: updated_user,
        authError: null,
        isLoading: false
      };
    case LOGOUT:
    case AUTO_LOGIN:
      return {
        user: null,
        authError: null,
        isLoading: false
      };
    case AUTO_LOGIN_FINISH:
      const autoUser = new User(
        action.payload.email,
        +action.payload.id,
        action.payload.access_token,
        action.payload.refresh_token,
        action.payload.username,
        action.payload.role);
      return {
        ...state,
        user: autoUser,
        authError: null,
        isLoading: false
      };
    case REFRESH_TOKEN:
      let refresh_user: User | null = null;
      if (state.user) {
        refresh_user = {
          ...state.user,
          access_token: action.payload.access_token
        };
      }
      return {
        ...state,
        user: refresh_user,
        authError: null,
        isLoading: false
      };
    case AUTH_ERROR:
      return {
        ...state,
        user: null,
        authError: action.payload,
        isLoading: false
      };
    default:
      return state;
  }
}
