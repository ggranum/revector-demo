import {Component, ChangeDetectionStrategy} from '@angular/core'
import {Observable} from 'rxjs'
import {Store} from '@ngrx/store'
import {
  RoleActions,
  Role,
  AuthServiceStoreState,
  SignInState,
  SignInStates,
  RoleState,
  PermissionState
} from '../../../../services/auth-service'
import {Update} from '../../../../shared/'


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

  roles$: Observable<RoleState>
  permissions$: Observable<PermissionState>

  constructor(private _store: Store<AuthServiceStoreState>) {
    _store.select((s: AuthServiceStoreState) => s.auth.transient.signInState).subscribe((v) => this.onSignedIn(v), (e) => this.onError(e))

    this.roles$ = _store.select((s: AuthServiceStoreState) => s.auth.roles)
    this.permissions$ = _store.select((s: AuthServiceStoreState) => s.auth.permissions)
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

