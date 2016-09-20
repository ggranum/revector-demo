import {Component, ChangeDetectionStrategy, Input} from '@angular/core'
import {Store} from '@ngrx/store'

import {AuthServiceState, User, CurrentUserActions, SignInStates, SignInState} from '@revector/auth-service'

// @revisit: There seems to be a bug. Using the /auth-service/index target for import causes Injection to fail.
// import {} from '@revector/auth-service';


@Component({
  selector: 'gg-top-nav-profile-component',
  templateUrl: 'top-nav-profile.component.html',
  styleUrls: ['top-nav-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopNavProfileComponent {

  @Input() signInState: SignInState = {
    state: SignInStates.unknown
  }
  @Input() user: User

  logoutButtonLabel: string = "Sign Out"

  showAccountFlyout: boolean = false

  constructor(private _store: Store<AuthServiceState>) {
  }

  isSignedIn(signInState: SignInState) {
    return signInState.state == SignInStates.signedIn
  }

  doLogoutAction() {
    this._store.dispatch(CurrentUserActions.signOut.invoke)
  }
}
