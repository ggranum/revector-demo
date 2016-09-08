import {Component, ChangeDetectionStrategy} from '@angular/core'
import {Observable} from 'rxjs'
import {Store} from '@ngrx/store'
import {AuthActions, Role, AuthServiceStoreData, SignInState, SignInStates} from '../../auth-service'
import {RoleActions} from '../../auth-service/state/role/role.actions'


@Component({
  selector: 'rv-role-list',
  template: ` 
 <rv-role-list-component [rolesObj]="roles$ | async"></rv-role-list-component>
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleListContainer {

  roles$: Observable<Role[]>

  constructor(private _store: Store<AuthServiceStoreData>, public actions:AuthActions) {
    _store.select((s: AuthServiceStoreData) => s.auth.transient.signInState).subscribe((v) => this.onSignedIn(v), (e) => this.onError(e))

    this.roles$ = _store.select((s: AuthServiceStoreData) => safe(() => s.auth.roles))
  }

  onSignedIn(value: SignInState) {
    if (value && value.state == SignInStates.signedIn) {
      this._store.dispatch(RoleActions.getRoles.invoke.action())
    }
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
