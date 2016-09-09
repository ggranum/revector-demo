import {Component, ChangeDetectionStrategy} from '@angular/core'
import {Observable} from 'rxjs'
import {Store} from '@ngrx/store'
import {AuthServiceStoreData, SignInState, UserInfo} from '../../../../services/auth-service/index'


@Component({
  selector: 'rv-user-list',
  template: ` 
 <rv-user-list-component [usersObj]="users$ | async"></rv-user-list-component>
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListContainer {

  users$: Observable<UserInfo[]>

  constructor(private _store: Store<AuthServiceStoreData>) {
    _store.select((s: AuthServiceStoreData) => s.auth.transient.signInState).subscribe((v) => this.onSignedIn(v), (e) => this.onError(e))

    this.users$ = _store.select((s: AuthServiceStoreData) => safe(() => s.auth.users))
  }

  onSignedIn(value: SignInState) {
    // if (value && value.state == SignInStates.signedIn) {
    //   this._store.dispatch(this.actions.requestUsers())
    // }
  }


  onError(e: Error): void {
    console.error("AuthEffects", "onError", e)
  }


}


let safe = function (fn: ()=>any) {
  try {
    return fn()
  } catch (e) {
    return null
  }
}
