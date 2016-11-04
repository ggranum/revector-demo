import {Component, ChangeDetectionStrategy} from '@angular/core'
import {Observable} from 'rxjs'
import {Store} from '@ngrx/store'
import {
  RoleActions,
  Role,
  Permission,
  AuthStoreState,
  SignInState,
  SignInStates
} from '@revector/auth-service'
import {
  Update,
  ObjMap
} from '@revector/shared'


@Component({
  selector: 'rv-role-list',
  template: ` 
 <rv-role-list-component [rolesObj]="roles$ | async"
 (addRole)="onAddRole($event)"
 [permissionsObj]="permissions$ | async"
 (roleChange)="onRoleChange($event)"
 (removeRole)="onRemoveRole($event)"
 ></rv-role-list-component>
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleListContainer {

  roles$: Observable<ObjMap<Role>>
  permissions$: Observable<ObjMap<Permission>>

  constructor(private _store: Store<AuthStoreState>) {
    _store.select((s: AuthStoreState) => s.auth.transient.signInState).subscribe((v) => this.onSignedIn(v), (e) => this.onError(e))

    this.roles$ = _store.select((s: AuthStoreState) => s.auth.roles)
    this.permissions$ = _store.select((s: AuthStoreState) => s.auth.permissions)
  }

  onSignedIn(value: SignInState) {
    if (value && value.state == SignInStates.signedIn) {
      this._store.dispatch(RoleActions.getRoles.invoke.action())
    }
  }

  onAddRole(role: Role) {
    this._store.dispatch(RoleActions.addRole.invoke.action(role))
  }

  onRoleChange(change: Update<Role>) {
    this._store.dispatch(RoleActions.updateRole.invoke.action(change))
  }

  onRemoveRole(role: Role) {
    this._store.dispatch(RoleActions.removeRole.invoke.action(role))
  }


  onError(e: Error): void {
    console.error("CurrentUserEffects", "onError", e)
  }
}

