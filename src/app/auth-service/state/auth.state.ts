import {ActionReducer, Action} from '@ngrx/store'
import {AuthActions, RequestAuthenticationAction, AuthenticationFailedAction} from './auth.actions'
import {AuthServiceSignInState, SignInStates} from '../interfaces'
import {RoleActions} from './role/role.actions'


let InitialState: AuthServiceSignInState = {
    signInState: { state: SignInStates.unknown},
}

export const AuthReducer: ActionReducer<AuthServiceSignInState> = (state = InitialState, action: Action) => {
  let newState: AuthServiceSignInState = null
  let actionKey: string = ActionKeysByToken[action.type]
  if (actionKey) {
    if (Reducers[actionKey]) {
      newState = Reducers[actionKey](state, action)
    } else {
      console.log(`Missing reducer function for '${actionKey}: ${action.type}'`)
    }
  }
  return newState || state
}

const Reducers: {[key: string]: (state: AuthServiceSignInState, action: Action) => AuthServiceSignInState} = {

  INITIALIZE: function (state: AuthServiceSignInState, action: Action): AuthServiceSignInState {
    console.log(RoleActions.initialize.action())
    let signedIn = action.payload != null
    let newState:AuthServiceSignInState = {
      signInState: {
        state: signedIn ? SignInStates.signedIn : SignInStates.signedOut,
      },
      currentUser: action.payload
    }
    state = Object.assign({}, state, newState )
    return state
  },

  REQUEST_SIGN_IN: function (state: AuthServiceSignInState, action: RequestAuthenticationAction): AuthServiceSignInState {
    let newState:AuthServiceSignInState = {
      signInState: {
        state: SignInStates.signingIn
      },
      currentUser: null
    }
    state = Object.assign({}, state, newState)
    return state
  },
  REQUEST_SIGN_IN_FULFILLED: function (state: AuthServiceSignInState, action: Action): AuthServiceSignInState {
    let signedIn = action.payload != null
    let newState:AuthServiceSignInState = {
      signInState: {
        state: signedIn ? SignInStates.signedIn : SignInStates.signedOut,
      },
      currentUser: action.payload
    }
    state = Object.assign({}, state, newState )
    return state
  },
  REQUEST_SIGN_IN_FAILED: function (state: AuthServiceSignInState, action: AuthenticationFailedAction): AuthServiceSignInState {
    let newState:AuthServiceSignInState = {
      signInState: {
        state: SignInStates.signInFailed,
        error: action.payload
      },
      currentUser: null
    }
    state = Object.assign({}, state, newState)
    return state
  },
  REQUEST_SIGN_UP: function (state: AuthServiceSignInState, action: Action): AuthServiceSignInState {
    let newState:AuthServiceSignInState = {
      signInState: {
        state: SignInStates.signingUp
      },
      currentUser: null
    }
    state = Object.assign({}, state, newState)
    return state
  },
  REQUEST_SIGN_UP_FULFILLED: function (state: AuthServiceSignInState, action: Action): AuthServiceSignInState {
    let newState:AuthServiceSignInState = {
      signInState: {
        state: SignInStates.newAccount
      },
      currentUser: action.payload
    }
    state = Object.assign({}, state, newState)
    return state
  },
  REQUEST_SIGN_UP_FAILED: function (state: AuthServiceSignInState, action: AuthenticationFailedAction): AuthServiceSignInState {
    let newState:AuthServiceSignInState = {
      signInState: {
        state: SignInStates.signUpFailed,
        error: action.payload
      },
      currentUser: null
    }
    state = Object.assign({}, state, newState)
    return state
  },
  REQUEST_SIGN_OUT: function (state: AuthServiceSignInState, action: Action): AuthServiceSignInState {
    let newState:AuthServiceSignInState = {
      signInState: {
        state: SignInStates.signingOut
      }
    }
    state = Object.assign({}, state, newState)
    return state
  },
  REQUEST_SIGN_OUT_FULFILLED: function (state: AuthServiceSignInState, action: Action): AuthServiceSignInState {
    let newState:AuthServiceSignInState = {
      signInState: {
        state: SignInStates.signedOut
      },
      currentUser: null
    }
    state = Object.assign({}, state, newState)
    return state
  },

}

const ActionKeysByToken: {[key: string]: string} = (() => {
  let result: {[key: string]: string} = {}
  Object.keys(AuthActions).forEach((key: string) => {
    let y: any = AuthActions
    let x: any = y[key]
    result[x] = key
  })
  return result
})()
