/* tslint:disable:no-unused-variable */

import {inject, TestBed} from '@angular/core/testing'
import {Store} from '@ngrx/store'

// NG RX
import {StoreModule} from '@ngrx/store'

// Dev modules
import {AuthReducers} from '../../'
import {AuthServiceStoreState, SignInStates, User} from '../../interfaces'


// Our Components
import {CurrentUserActions} from '../../state/current-user/current-user.actions'

let reducers = {
  auth: AuthReducers
}


describe('Auth-services.state.current-user', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        StoreModule.provideStore(reducers),
      ],
    })
  })

  it('Loads the ', () => {
    expect(1).toBeTruthy();
  });

  it('on "signIn.invoke", sets the signInState to unknown and clears user info',
    inject([Store], (_store: Store<AuthServiceStoreState>) => {
        let expectedState = SignInStates.unknown
        let state: AuthServiceStoreState = null

        let subscription = _store.select((s: AuthServiceStoreState) => {
          state = s;
          return s.auth.transient.signInState
        }).subscribe((v) => {
          if (v.state === SignInStates.unknown) {
            expect(v.state).toEqual(expectedState, 'SignIn State should match the action.')
          } else if (v.state === SignInStates.signingIn) {
            expect(state.auth.transient.currentUser).toBeFalsy('Current user should be unset on sign in.')
            subscription.unsubscribe()
          }
        }, (e) => {
          subscription.unsubscribe()
          fail(e)
        })

        let actionFn = () => {
          expectedState = SignInStates.signingIn
          return {
            email: 'example@example.com',
            password: 'bob'
          }
        }

        _store.dispatch(CurrentUserActions.signIn.invoke.action(actionFn()))
      }
    ));

  it('on "signIn.fulfilled", sets the signInState to "signedIn" and sets the current user to the payload',
    inject([Store], (_store: Store<AuthServiceStoreState>) => {
        let expectedState = SignInStates.unknown
        let userDisplayName = 'Test User'
        let state: AuthServiceStoreState = null
        let subscription = _store.select((s: AuthServiceStoreState) => {
          state = s;
          return s.auth.transient.signInState
        }).subscribe((v) => {
          if (v.state === SignInStates.unknown) {
            expect(v.state).toEqual(expectedState, 'SignIn State should match the action.')
          } else if (v.state === SignInStates.signedIn) {
            expect(state.auth.transient.currentUser).toBeTruthy('Current user should be set on sign in.')
            expect(state.auth.transient.currentUser.displayName).toEqual(userDisplayName)
            subscription.unsubscribe()
          }
        }, (e) => {
          subscription.unsubscribe()
          fail(e)
        })

        let actionFn = (): User => {
          expectedState = SignInStates.signedIn
          return {
            createdMils: Date.now(),
            displayName: userDisplayName
          }
        }

        _store.dispatch(CurrentUserActions.signIn.fulfilled.action(actionFn()))
      }
    ));


  it('on "signUp.invoke", sets the signedInState to "signingUp" and clears user info',
    inject([Store], (_store: Store<AuthServiceStoreState>) => {
        let expectedState = SignInStates.unknown
        let state: AuthServiceStoreState = null
        let subscription = _store.select((s: AuthServiceStoreState) => {
          state = s;
          return s.auth.transient.signInState
        }).subscribe((v) => {
          if (v.state === SignInStates.unknown) {
            expect(v.state).toEqual(expectedState, 'SignIn State should match the action.')
          } else if (v.state === SignInStates.signingIn) {
            expect(state.auth.transient.currentUser).toBeFalsy('Current user should be unset on sign in.')
            subscription.unsubscribe()
          }
        }, (e) => {
          subscription.unsubscribe()
          fail(e)
        })
        let actionFn = () => {
          expectedState = SignInStates.signingUp
          return {
            email: 'example@example.com',
            password: 'bob'
          }
        }
        _store.dispatch(CurrentUserActions.signUp.invoke.action(actionFn()))
      }
    ));

  it('on "signUp.fulfilled", sets the signInState to "newAccount" and sets the current user to the payload',
    inject([Store], (_store: Store<AuthServiceStoreState>) => {
        let expectedState = SignInStates.unknown
        let userDisplayName = 'Test User'
        let state: AuthServiceStoreState = null
        let subscription = _store.select((s: AuthServiceStoreState) => {
          state = s;
          return s.auth.transient.signInState
        }).subscribe((v) => {
          if (v.state === SignInStates.unknown) {
            expect(v.state).toEqual(expectedState, 'SignIn State should match the action.')
          } else if (v.state === SignInStates.newAccount) {
            expect(state.auth.transient.currentUser).toBeTruthy('Current user should be set on sign in.')
            expect(state.auth.transient.currentUser.displayName).toEqual(userDisplayName)
            subscription.unsubscribe()
          }
        }, (e) => {
          subscription.unsubscribe()
          fail(e)
        })

        let actionFn = (): User => {
          expectedState = SignInStates.newAccount
          return {
            createdMils: Date.now(),
            displayName: userDisplayName
          }
        }

        _store.dispatch(CurrentUserActions.signUp.fulfilled.action(actionFn()))
      }
    ));

  it('on "signOut.invoke", sets the signedInState to "signingOut" and clears user info',
    inject([Store], (_store: Store<AuthServiceStoreState>) => {
        let expectedState = SignInStates.unknown
        let state: AuthServiceStoreState = null
        let subscription = _store.select((s: AuthServiceStoreState) => {
          state = s;
          return s.auth.transient.signInState
        }).subscribe((v) => {
          if (v.state === SignInStates.unknown) {
            expect(v.state).toEqual(expectedState, 'SignIn State should match the action.')
          } else if (v.state === SignInStates.signingOut) {
            expect(state.auth.transient.currentUser).toBeFalsy('Current user should be unset on sign out.')
            subscription.unsubscribe()
          }
        }, (e) => {
          subscription.unsubscribe()
          fail(e)
        })
        let actionFn = () => {
          expectedState = SignInStates.signingOut
          return null
        }
        _store.dispatch(CurrentUserActions.signOut.invoke.action(actionFn()))
      }
    ));

  it('on "signOut.fulfilled", sets the signedInState to "signedOut" and user info is empty',
    inject([Store], (_store: Store<AuthServiceStoreState>) => {
        let expectedState = SignInStates.unknown
        let state: AuthServiceStoreState = null
        let subscription = _store.select((s: AuthServiceStoreState) => {
          state = s;
          return s.auth.transient.signInState
        }).subscribe((v) => {
          if (v.state === SignInStates.unknown) {
            expect(v.state).toEqual(expectedState, 'SignIn State should match the action.')
          } else if (v.state === SignInStates.signedOut) {
            expect(state.auth.transient.currentUser).toBeFalsy('Current user should be unset on sign out.')
            subscription.unsubscribe()
          }
        }, (e) => {
          subscription.unsubscribe()
          fail(e)
        })
        let actionFn = () => {
          expectedState = SignInStates.signedOut
          return null
        }
        _store.dispatch(CurrentUserActions.signOut.invoke.action(actionFn()))
      }
    ));


});
