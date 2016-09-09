import {Component, ChangeDetectionStrategy} from '@angular/core'
import {Observable} from 'rxjs'
import {Store} from '@ngrx/store'
import {
  RoleActions,
  Role,
  AuthServiceStoreData,
  SignInState,
  SignInStates
} from '../../../../services/auth-service/index'
import {ObjMap} from '../../../../shared'


@Component({
  selector: 'rv-role-list',
  template: ` 
 <rv-role-list-component [rolesObj]="roles$ | async"
 (addRole)="onAddRole($event)"
 (roleChange)="onRoleChange($event)"
 (removeRole)="onRemoveRole($event)"
 ></rv-role-list-component>
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleListContainer {

  roles$: Observable<ObjMap<Role>>

  constructor(private _store: Store<AuthServiceStoreData>) {
    _store.select((s: AuthServiceStoreData) => s.auth.transient.signInState).subscribe((v) => this.onSignedIn(v), (e) => this.onError(e))

    this.roles$ = _store.select((s: AuthServiceStoreData) => s.auth.roles)
  }

  onSignedIn(value: SignInState) {
    if (value && value.state == SignInStates.signedIn) {
      this._store.dispatch(RoleActions.getRoles.invoke.action())
    }
  }

  onAddRole(role: Role) {
    this._store.dispatch(RoleActions.addRole.invoke.action(role))
  }

  onRoleChange(role: Role) {
    this._store.dispatch(RoleActions.updateRole.invoke.action(role))
  }

  onRemoveRole(role: Role) {
    this._store.dispatch(RoleActions.removeRole.invoke.action(role))
  }



  onError(e: Error): void {
    console.error("AuthEffects", "onError", e)
  }
}

