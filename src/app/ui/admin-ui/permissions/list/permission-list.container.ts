import {Component, ChangeDetectionStrategy} from '@angular/core'
import {Observable} from 'rxjs'
import {Store} from '@ngrx/store'
import {
  PermissionActions,
  Permission,
  AuthServiceStoreData,
  SignInState,
  SignInStates
} from '../../../../services/auth-service/index'
import {ObjMap} from '../../../../shared'


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

  constructor(private _store: Store<AuthServiceStoreData>) {
    _store.select((s: AuthServiceStoreData) => s.auth.transient.signInState).subscribe((v) => this.onSignedIn(v), (e) => this.onError(e))

    this.permissions$ = _store.select((s: AuthServiceStoreData) => s.auth.permissions)
  }

  onSignedIn(value: SignInState) {
    if (value && value.state == SignInStates.signedIn) {
      this._store.dispatch(PermissionActions.getPermissions.invoke.action())
    }
  }

  onAddPermission(permission: Permission) {
    this._store.dispatch(PermissionActions.addPermission.invoke.action(permission))
  }

  onPermissionChange(permission: Permission) {
    this._store.dispatch(PermissionActions.updatePermission.invoke.action(permission))
  }

  onRemovePermission(permission: Permission) {
    this._store.dispatch(PermissionActions.removePermission.invoke.action(permission))
  }



  onError(e: Error): void {
    console.error("AuthEffects", "onError", e)
  }
}

