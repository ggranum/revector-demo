import {Component, ChangeDetectionStrategy, Input} from '@angular/core'
import {Store} from '@ngrx/store'
import {AuthServiceStoreState, SignInStates, SignInState, CurrentUserActions} from '../../services/auth-service';


@Component({
  selector: 'gg-top-nav-login-component',
  templateUrl: 'top-nav-login.component.html',
  styleUrls: ['top-nav-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopNavLoginComponent {

  @Input() signInState: SignInState  = {
    state: SignInStates.unknown
  }
  @Input() errorMessage:string

  username:string
  password:string

  usernameFieldLabel:string = "email"
  passwordFieldLabel:string = "password"
  loginButtonLabel:string = "Sign In"
  signupButtonLabel:string = "Sign Up"

  constructor( private _store: Store<AuthServiceStoreState>) {
  }

  isSignedOut(signInState:SignInState){
    return signInState.state  == SignInStates.signedOut
  }

  isSigningUp(signInState:SignInState){
    return signInState.state  == SignInStates.signingUp
  }

  isUnknownState(signInState:SignInState){
    return signInState.state  == SignInStates.unknown
  }
  doLoginAction(event:Event) {
    event.preventDefault()
    event.stopPropagation()
    this._store.dispatch(CurrentUserActions.signIn.invoke.action({email: this.username, password:this.password}))
  }

  doSignupAction() {
    this._store.dispatch(CurrentUserActions.signUp.invoke.action({email: this.username, password:this.password}))
  }

  onSubmit(event:Event) {
    event.preventDefault()
    event.stopPropagation()
  }
}
