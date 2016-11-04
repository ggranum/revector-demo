import {Action} from '@ngrx/store'
import {CurrentUserActions} from './current-user.actions'
import {CurrentUserState, SignInStates, AuthServiceState} from '../../interfaces'
import {ActionReducerSet} from '@revector/shared'


export const currentUserReducers = new ActionReducerSet<AuthServiceState>()

const MAPPING = {
  toMapped: (state: AuthServiceState): CurrentUserState => {
    return state.transient.signInState
  },
  fromMapped: (state: AuthServiceState, mapped: CurrentUserState): AuthServiceState => {
    state.transient = mapped
    return state
  },
}

currentUserReducers.registerMapped(CurrentUserActions.initialize,
  MAPPING,
  (state: CurrentUserState, action: Action): CurrentUserState => {
    let signedIn = action.payload != null
    let newState: CurrentUserState = {
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
  (state: CurrentUserState, action: Action): CurrentUserState => {
    let newState: CurrentUserState = {
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
  (state: CurrentUserState, action: Action): CurrentUserState => {
    let signedIn = action.payload != null
    let newState: CurrentUserState = {
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
  (state: CurrentUserState, action: Action): CurrentUserState => {
    let newState: CurrentUserState = {
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
  (state: CurrentUserState, action: Action): CurrentUserState => {
    let newState: CurrentUserState = {
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
  (state: CurrentUserState, action: Action): CurrentUserState => {
    let newState: CurrentUserState = {
      signInState: {
        state: SignInStates.signedIn
      },
      currentUser: action.payload
    }
    state = Object.assign({}, state, newState)
    return state
  })
currentUserReducers.registerMapped(CurrentUserActions.signUp.failed,
  MAPPING,
  (state: CurrentUserState, action: Action): CurrentUserState => {
    let newState: CurrentUserState = {
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
  (state: CurrentUserState, action: Action): CurrentUserState => {
    let newState: CurrentUserState = {
      signInState: {
        state: SignInStates.signingOut
      }
    }
    state = Object.assign({}, state, newState)
    return state
  })
currentUserReducers.registerMapped(CurrentUserActions.signOut.fulfilled,
  MAPPING,
  (state: CurrentUserState, action: Action): CurrentUserState => {
    let newState: CurrentUserState = {
      signInState: {
        state: SignInStates.signedOut
      },
      currentUser: null
    }
    state = Object.assign({}, state, newState)
    return state
  })
