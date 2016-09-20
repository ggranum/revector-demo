import {Component, ChangeDetectionStrategy} from '@angular/core'
import {Observable} from 'rxjs'
import {Store} from '@ngrx/store'
import {
  PermissionActions,
  Permission,
  AuthServiceStoreState,
  SignInState,
  SignInStates,
  PermissionState
} from '../../../../services/auth-service'
import {Update} from '../../../../shared'


@Component({
  selector: 'rv-permission-list',
  template: ` 
 <rv-permission-list-component [permissionsObj]="permissions$ | async"
 (addPermission)="onAddPermission($event)"
 (permissionChange)="onPermissionChange($event)"
 (removePermission)="onRemovePermission($event)"
 ></rv-permission-list-component>
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionListContainer {

  permissions$: Observable<PermissionState>

  constructor(private _store: Store<AuthServiceStoreState>) {
    _store.select((s: AuthServiceStoreState) => {
      return s.auth.transient.signInState
    }).subscribe((v) => this.onSignedIn(v), (e) => this.onError(e))

    this.permissions$ = _store.select((s: AuthServiceStoreState) => s.auth.permissions)
  }

  onSignedIn(value: SignInState) {
    if (value && value.state == SignInStates.signedIn) {
      this._store.dispatch(PermissionActions.getPermissions.invoke.action())
    }
  }

  onAddPermission(permission: Permission) {
    this._store.dispatch(PermissionActions.addPermission.invoke.action(permission))
  }

  onPermissionChange(change: Update<Permission>) {
    this._store.dispatch(PermissionActions.updatePermission.invoke.action(change))
  }

  onRemovePermission(permission: Permission) {
    this._store.dispatch(PermissionActions.removePermission.invoke.action(permission))
  }

  onError(e: Error): void {
    console.error("CurrentUserEffects", "onError", e)
  }
}

