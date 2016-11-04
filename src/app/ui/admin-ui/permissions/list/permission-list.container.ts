import {Component, ChangeDetectionStrategy} from '@angular/core'
import {Observable} from 'rxjs'
import {Store} from '@ngrx/store'
import {
  PermissionActions,
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

  permissions$: Observable<ObjMap<Permission>>

  constructor(private _store: Store<AuthStoreState>) {
    _store.select((s: AuthStoreState) => {
      return s.auth.transient.signInState
    }).subscribe((v) => this.onSignedIn(v), (e) => this.onError(e))

    this.permissions$ = _store.select((s: AuthStoreState) => s.auth.permissions)
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

