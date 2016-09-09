import {Component, ChangeDetectionStrategy} from '@angular/core'
import {Observable} from 'rxjs'
import {Store} from '@ngrx/store'
import {UserInfo, SignInState, AuthServiceStoreData} from '../../services/auth-service'


@Component({
  selector: 'gg-top-nav-login',
  template: `
<gg-top-nav-login-component [signInState]="signInState$ | async" [errorMessage]="errorMessage | async"></gg-top-nav-login-component>
<gg-top-nav-profile-component [signInState]="signInState$ | async" [user]="user$ | async"></gg-top-nav-profile-component>
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopNavLoginContainer {

  signInState$: Observable<SignInState>
  user$: Observable<UserInfo>
  errorMessage:Observable<string>

  constructor(private _store: Store<AuthServiceStoreData>) {
    this.signInState$ = _store.select((s:AuthServiceStoreData) => safe(() => s.auth.transient.signInState) )
    this.user$ = _store.select((s:AuthServiceStoreData) => safe(() => s.auth.transient.currentUser) )
  }
}


let safe = function(fn:()=>any){
  try {
    return fn()
  } catch (e) {
    return null
  }
}
