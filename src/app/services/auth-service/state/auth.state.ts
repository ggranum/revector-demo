import {ActionReducer, Action} from '@ngrx/store'
import {AuthActions} from './auth.actions'
import {AuthServiceSignInState, SignInStates} from '../interfaces'
import {ActionReducers} from '../../../shared'


let initialState: AuthServiceSignInState = {
  signInState: {state: SignInStates.unknown},
}

const actionReducers = new ActionReducers<AuthServiceSignInState>('[Auth.app]', initialState)
export const AuthReducer: ActionReducer<AuthServiceSignInState> = actionReducers.reducer()

actionReducers.register(AuthActions.initialize, (state: AuthServiceSignInState, action: Action): AuthServiceSignInState => {
  let signedIn = action.payload != null
  let newState: AuthServiceSignInState = {
    signInState: {
      state: signedIn ? SignInStates.signedIn : SignInStates.signedOut,
    },
    currentUser: action.payload
  }
  state = Object.assign({}, state, newState)
  return state
})

actionReducers.register(AuthActions.signIn.invoke, (state: AuthServiceSignInState, action: Action): AuthServiceSignInState => {
  let newState: AuthServiceSignInState = {
    signInState: {
      state: SignInStates.signingIn
    },
    currentUser: null
  }
  state = Object.assign({}, state, newState)
  return state
})


actionReducers.register(AuthActions.signIn.fulfilled, (state: AuthServiceSignInState, action: Action): AuthServiceSignInState => {
  let signedIn = action.payload != null
  let newState: AuthServiceSignInState = {
    signInState: {
      state: signedIn ? SignInStates.signedIn : SignInStates.signedOut,
    },
    currentUser: action.payload
  }
  state = Object.assign({}, state, newState)
  return state
})
actionReducers.register(AuthActions.signIn.failed, (state: AuthServiceSignInState, action: Action): AuthServiceSignInState => {
  let newState: AuthServiceSignInState = {
    signInState: {
      state: SignInStates.signInFailed,
      error: action.payload
    },
    currentUser: null
  }
  state = Object.assign({}, state, newState)
  return state
})
actionReducers.register(AuthActions.signUp.invoke, (state: AuthServiceSignInState, action: Action): AuthServiceSignInState => {
  let newState: AuthServiceSignInState = {
    signInState: {
      state: SignInStates.signingUp
    },
    currentUser: null
  }
  state = Object.assign({}, state, newState)
  return state
})
actionReducers.register(AuthActions.signUp.fulfilled, (state: AuthServiceSignInState, action: Action): AuthServiceSignInState => {
  let newState: AuthServiceSignInState = {
    signInState: {
      state: SignInStates.newAccount
    },
    currentUser: action.payload
  }
  state = Object.assign({}, state, newState)
  return state
})
actionReducers.register(AuthActions.signUp.failed, (state: AuthServiceSignInState, action: Action): AuthServiceSignInState => {
  let newState: AuthServiceSignInState = {
    signInState: {
      state: SignInStates.signUpFailed,
      error: action.payload
    },
    currentUser: null
  }
  state = Object.assign({}, state, newState)
  return state
})
actionReducers.register(AuthActions.signOut.invoke, (state: AuthServiceSignInState, action: Action): AuthServiceSignInState => {
  let newState: AuthServiceSignInState = {
    signInState: {
      state: SignInStates.signingOut
    }
  }
  state = Object.assign({}, state, newState)
  return state
})
actionReducers.register(AuthActions.signOut.fulfilled, (state: AuthServiceSignInState, action: Action): AuthServiceSignInState => {
  let newState: AuthServiceSignInState = {
    signInState: {
      state: SignInStates.signedOut
    },
    currentUser: null
  }
  state = Object.assign({}, state, newState)
  return state
})
