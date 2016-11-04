import {Component, ChangeDetectionStrategy} from '@angular/core'
import {Observable} from 'rxjs'
import {Store} from '@ngrx/store'
import {User, SignInState, AuthStoreState} from '@revector/auth-service'
import {safe} from "@revector/shared";


@Component({
  selector: 'rv-inline-login-form',
  template: `
<rv-inline-login-form-component [signInState]="signInState$ | async" [errorMessage]="errorMessage | async"></rv-inline-login-form-component>
<rv-inline-profile-component [signInState]="signInState$ | async" [user]="user$ | async"></rv-inline-profile-component>
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InlineLoginFormContainer {

  signInState$: Observable<SignInState>
  user$: Observable<User>
  errorMessage: Observable<string>

  constructor(private _store: Store<AuthStoreState>) {
    this.signInState$ = _store.select((s: AuthStoreState) => safe(() => s.auth.transient.signInState))
    this.user$ = _store.select((s: AuthStoreState) => safe(() => s.auth.transient.currentUser))
  }
}
