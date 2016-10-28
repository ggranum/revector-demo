import {
  Component,
  ChangeDetectionStrategy,
  Input
} from '@angular/core'
import {Observable} from "rxjs";
import {
  SignInState,
  User,
  AuthServiceStoreState,
  SignInStates,
  AuthServiceState,
  CurrentUserActions
} from "@revector/auth-service";
import {Store} from "@ngrx/store";
import {safe} from "@revector/shared";
import {Router} from "@angular/router";

@Component({
  selector: 'main-component',
  templateUrl: 'main.component.html',
  styleUrls: ['app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent {
  @Input() user:User
  @Input() signInState:SignInState
  title = 'ReVector Demo'
  asciidoctorContent: string = ''
  errorMessage: Observable<string>
  loginButtonLabel: string = "Sign In"


  constructor(private router: Router, private _store: Store<AuthServiceState>) {

  }

  doSignIn() {
    this.router.navigate(['./sign-in', {redirect:''}]);
  }

  doSignOut() {
    this._store.dispatch(CurrentUserActions.signOut.invoke)
  }

  userIsAdmin(){
    return this.user && !this.user.isAnonymous
  }

  navigateToAdmin(){
    this.router.navigate(['./admin']);
  }

  isSignedIn(signInState: SignInState) {
    return signInState.state == SignInStates.signedIn
  }

}



