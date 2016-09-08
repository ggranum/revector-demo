import {Injectable} from "@angular/core";
import {Action} from "@ngrx/store";
import {UserInfo} from '../interfaces'


export interface RequestAuthenticationPayload {
  email: string,
  password: string
}
export interface RequestAuthenticationAction extends Action {
  payload: RequestAuthenticationPayload
}

export interface AuthenticationFailedPayload {
  code: string,
  message: string
}
export interface AuthenticationFailedAction extends Action {
  payload: AuthenticationFailedPayload
}


@Injectable()
export class AuthActions {

  constructor() {
  }

  static INITIALIZE = '[Auth.app] Initialize'

  initialize(user: UserInfo): Action {
    return {
      type: AuthActions.INITIALIZE,
      payload: user
    }
  }

  static REQUEST_SIGN_IN = '[Auth.app] Request Sign In'

  requestLogin(email: string, password: string, rememberMe: boolean): RequestAuthenticationAction {
    return {
      type: AuthActions.REQUEST_SIGN_IN,
      payload: {
        email: email,
        password: password
      }
    }
  }

  static REQUEST_SIGN_IN_FULFILLED = '[Auth.app] Request Sign In Fulfilled'

  requestSignInFulfilled(payload: UserInfo): Action {
    return {
      type: AuthActions.REQUEST_SIGN_IN_FULFILLED,
      payload: payload
    }
  }

  static REQUEST_SIGN_N_FAILED = '[Auth.app] Request Sign In Failed'

  requestSignInFailed(payload: AuthenticationFailedPayload): AuthenticationFailedAction {
    return {
      type: AuthActions.REQUEST_SIGN_N_FAILED,
      payload: payload
    }
  }


  static REQUEST_SIGN_UP = '[Auth.app] Request Sign Up'

  requestSignUp(email: string, password: string, rememberMe: boolean): RequestAuthenticationAction {
    return {
      type: AuthActions.REQUEST_SIGN_UP,
      payload: {
        email: email,
        password: password
      }
    }
  }

  static REQUEST_SIGN_UP_FULFILLED = '[Auth.app] Request Sign Up Fulfilled'
  requestSignUpFulfilled(payload: UserInfo): Action {
    return {
      type: AuthActions.REQUEST_SIGN_UP_FULFILLED,
      payload: payload
    }
  }

  static REQUEST_SIGN_UP_FAILED = '[Auth.app] Request Sign Up Failed'
  requestSignUpFailed(payload: AuthenticationFailedPayload): AuthenticationFailedAction {
    return {
      type: AuthActions.REQUEST_SIGN_UP_FAILED,
      payload: payload
    }
  }

  static REQUEST_SIGN_OUT = '[Auth.app] Request sign out'

  requestLogout(): Action {
    return {
      type: AuthActions.REQUEST_SIGN_OUT
    }
  }

  static REQUEST_SIGN_OUT_FULFILLED = '[Auth.app] Request sign out fulfilled'

  requestSignOutFulfilled(): Action {
    return {
      type: AuthActions.REQUEST_SIGN_OUT_FULFILLED
    }
  }



}
