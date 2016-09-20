import {Action} from '@ngrx/store'
import {CurrentUserActions} from './current-user.actions'
import {AuthServiceSignInState, SignInStates, AuthServiceState} from '../../interfaces'
import {ActionReducerSet} from '../../../../shared'


export const currentUserReducers = new ActionReducerSet<AuthServiceState>()

const MAPPING = {
  toMapped: (state: AuthServiceState): AuthServiceSignInState => {
    return state.transient.signInState
  },
  fromMapped: (state: AuthServiceState, mapped: AuthServiceSignInState): AuthServiceState => {
    state.transient = mapped
    return state
  },
}

currentUserReducers.registerMapped(CurrentUserActions.initialize,
  MAPPING,
  (state: AuthServiceSignInState, action: Action): AuthServiceSignInState => {
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

currentUserReducers.registerMapped(CurrentUserActions.signIn.invoke,
  MAPPING,
  (state: AuthServiceSignInState, action: Action): AuthServiceSignInState => {
    let newState: AuthServiceSignInState = {
      signInState: {
        state: SignInStates.signingIn
      },
      currentUser: null
    }
    state = Object.assign({}, state, newState)
    return state
  })


currentUserReducers.registerMapped(CurrentUserActions.signIn.fulfilled,
  MAPPING,
  (state: AuthServiceSignInState, action: Action): AuthServiceSignInState => {
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
currentUserReducers.registerMapped(CurrentUserActions.signIn.failed,
  MAPPING,
  (state: AuthServiceSignInState, action: Action): AuthServiceSignInState => {
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
currentUserReducers.registerMapped(CurrentUserActions.signUp.invoke,
  MAPPING,
  (state: AuthServiceSignInState, action: Action): AuthServiceSignInState => {
    let newState: AuthServiceSignInState = {
      signInState: {
        state: SignInStates.signingUp
      },
      currentUser: null
    }
    state = Object.assign({}, state, newState)
    return state
  })
currentUserReducers.registerMapped(CurrentUserActions.signUp.fulfilled,
  MAPPING,
  (state: AuthServiceSignInState, action: Action): AuthServiceSignInState => {
    let newState: AuthServiceSignInState = {
      signInState: {
        state: SignInStates.newAccount
      },
      currentUser: action.payload
    }
    state = Object.assign({}, state, newState)
    return state
  })
currentUserReducers.registerMapped(CurrentUserActions.signUp.failed,
  MAPPING,
  (state: AuthServiceSignInState, action: Action): AuthServiceSignInState => {
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
currentUserReducers.registerMapped(CurrentUserActions.signOut.invoke,
  MAPPING,
  (state: AuthServiceSignInState, action: Action): AuthServiceSignInState => {
    let newState: AuthServiceSignInState = {
      signInState: {
        state: SignInStates.signingOut
      }
    }
    state = Object.assign({}, state, newState)
    return state
  })
currentUserReducers.registerMapped(CurrentUserActions.signOut.fulfilled,
  MAPPING,
  (state: AuthServiceSignInState, action: Action): AuthServiceSignInState => {
    let newState: AuthServiceSignInState = {
      signInState: {
        state: SignInStates.signedOut
      },
      currentUser: null
    }
    state = Object.assign({}, state, newState)
    return state
  })
