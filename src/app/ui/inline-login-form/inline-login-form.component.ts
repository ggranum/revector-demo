import {Component, ChangeDetectionStrategy, Input} from '@angular/core'
import {Store} from '@ngrx/store'
import {AuthServiceStoreState, SignInStates, SignInState, CurrentUserActions} from '@revector/auth-service';


@Component({
  selector: 'rv-inline-login-form-component',
  templateUrl: 'inline-login-form.component.html',
  styleUrls: ['inline-login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InlineLoginFormComponent {

  @Input() signInState: SignInState = {
    state: SignInStates.unknown
  }
  @Input() errorMessage: string

  username: string
  password: string

  usernameFieldLabel: string = "email"
  passwordFieldLabel: string = "password"
  loginButtonLabel: string = "Sign In"
  signupButtonLabel: string = "Sign Up"

  constructor(private _store: Store<AuthServiceStoreState>) {
  }

  isSignedOut(signInState: SignInState) {
    return signInState.state == SignInStates.signedOut
  }

  isSigningUp(signInState: SignInState) {
    return signInState.state == SignInStates.signingUp
  }

  isUnknownState(signInState: SignInState) {
    return signInState.state == SignInStates.unknown
  }

  doLoginAction(event: Event) {
    event.preventDefault()
    event.stopPropagation()
    this._store.dispatch(CurrentUserActions.signIn.invoke.action({email: this.username, password: this.password}))
  }

  doSignupAction() {
    this._store.dispatch(CurrentUserActions.signUp.invoke.action({email: this.username, password: this.password}))
  }

  onSubmit(event: Event) {
    event.preventDefault()
    event.stopPropagation()
  }
}
