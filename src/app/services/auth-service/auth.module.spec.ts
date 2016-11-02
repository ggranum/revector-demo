/* tslint:disable:no-unused-variable */

import {inject, TestBed} from '@angular/core/testing'
import {Store} from '@ngrx/store'
import {AuthServiceStoreState, SignInStates} from './models'

// NG RX
import {StoreModule} from '@ngrx/store'

// Dev modules
import {AuthReducers} from './'


// Our Components
import {CurrentUserActions} from './state/current-user/current-user.actions';

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

  //
  // it('Load module',
  //   inject([Store], (_store: Store<AuthServiceStoreState>) => {
  //       let expectedState = SignInStates.unknown
  //       _store.select((s: AuthServiceStoreState) => s.auth.transient.signInState).subscribe((v) => {
  //         expect(v.state).toEqual(expectedState, 'State should be updated')
  //       }, (e) => this.onError(e))
  //
  //       let actionFn = () => {
  //         expectedState = SignInStates.signingIn
  //         return {
  //           email: 'example@example.com',
  //           password: 'bob'
  //         }
  //       }
  //
  //       _store.dispatch(CurrentUserActions.signIn.invoke.action(actionFn()))
  //     }
  //   ));


});
