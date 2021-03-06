import {Component, ChangeDetectionStrategy} from '@angular/core'
import {safe} from "@revector/shared";
import {
  AuthStoreState,
  User,
  SignInState
} from "@revector/auth-service";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";



@Component({
  selector: 'main-container',
  template: `<main-component [signInState]="signInState$ | async" [user]="user$ | async"></main-component>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainContainer
{
  signInState$: Observable<SignInState>
  user$: Observable<User>

  constructor(private _store: Store<AuthStoreState>) {
    this.signInState$ = _store.select((s: AuthStoreState) => safe(() =>  s.auth.transient.signInState))
    this.user$ = _store.select((s: AuthStoreState) => safe(() => s.auth.transient.currentUser))
  }
}
