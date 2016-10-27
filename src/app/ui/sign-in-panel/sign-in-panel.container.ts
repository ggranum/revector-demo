import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ViewEncapsulation,
  EventEmitter,
  Output
} from '@angular/core'
import {Observable} from 'rxjs'
import {Store} from '@ngrx/store'
import {
  User,
  SignInState,
  AuthServiceStoreState,
  CurrentUserActions
} from '@revector/auth-service'
import {AuthInfo} from "./sign-in-panel.component";


@Component({
  selector: 'rv-sign-in-panel',
  template: `<rv-sign-in-panel-component
  [username]="username"
  (signIn)="onSignIn($event)"
  (signUp)="onSignUp($event)"
  (forgotPassword)="onForgotPassword($event)"

  [preventSubmit]="true"
  [displayMode]="signIn"
  [requireEmailUsername]="true"
>

</rv-sign-in-panel-component>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInPanelContainer {

  @Input() username: string = ""
  @Input() requireEmailUsername: boolean

  user$: Observable<User>

  constructor(private _store: Store<AuthServiceStoreState>) {
    this.user$ = _store.select((s: AuthServiceStoreState) => safe(() => s.auth.transient.currentUser))
  }

  onSignIn(authInfo: AuthInfo) {
    this._store.dispatch(CurrentUserActions.signIn.invoke.action({
      email: authInfo.username,
      password: authInfo.password
    }))
  }

  onSignUp(authInfo: AuthInfo) {
    this._store.dispatch(CurrentUserActions.signUp.invoke.action({
      email: authInfo.username,
      password: authInfo.password
    }))
  }

  onForgotPassword(authInfo: AuthInfo) {
    console.log('SignInPanelDemo', 'onForgotPassword', authInfo)
  }
}


let safe = function (fn: ()=>any) {
  try {
    return fn()
  } catch (e) {
    return null
  }
}
