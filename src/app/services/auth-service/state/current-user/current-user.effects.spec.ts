/* tslint:disable:no-unused-variable */

import {inject, TestBed} from '@angular/core/testing'
import {Store} from '@ngrx/store'

// NG RX
import {StoreModule} from '@ngrx/store'

// Dev modules
import {AuthReducers} from '../../'
import {AuthServiceStoreState, SignInStates} from '../../models'


// Our Components
import {CurrentUserActions} from '@revector/auth-service'

let reducers = {
  auth: AuthReducers
}


describe('Auth-services.current-user.effects', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        StoreModule.provideStore(reducers),
        // CurrentUserEffects
      ],
    })
  })

  it('on "signIn.invoke", something something.',
    inject([Store], (_store: Store<AuthServiceStoreState>) => {


      }
    ));




});
