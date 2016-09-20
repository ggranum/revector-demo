import {Component, ChangeDetectionStrategy, Input, EventEmitter, Output} from '@angular/core'
import {Observable} from 'rxjs'
import {Store} from '@ngrx/store'
import {
  RoleActions,
  Role,
  AuthServiceStoreState,
  SignInState,
  SignInStates,
  RolePermissionsMappings,
  MappedPermission,
  Permission,
  RolePermission,
} from '@revector/auth-service'
import {ObjMap} from '@revector/shared'


@Component({
  selector: 'rv-role',
  template: ` 
 <rv-role-component layout-fill
               [role]="role"
               [permissions]="permissions"
               [rolePermissions]="rolePermissions$ | async"
               (change)="change.emit($event)"
               (addRolePermission)="onAddRolePermission($event)"
               (removeRolePermission)="onRemoveRolePermission($event)"
               (removeRole)="removeUser.emit($event)"
               (focus)="focus.emit($event)"
               (blur)="blur.emit($event)"
      ></rv-role-component>
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleContainer {

  @Input() role: Role
  @Input() permissions: Permission[]

  @Output() change: Observable<Role> = new EventEmitter<Role>(false)
  @Output() removeRole: EventEmitter<Role> = new EventEmitter<Role>(false)


  @Output() focus: EventEmitter<Event> = new EventEmitter<Event>(false)
  @Output() blur: EventEmitter<Event> = new EventEmitter<Event>(false)

  rolePermissions$: Observable<ObjMap<MappedPermission>>

  constructor(private _store: Store<AuthServiceStoreState>) {
    _store.select((s: AuthServiceStoreState) => s.auth.transient.signInState).subscribe((v) => this.onSignedIn(v), (e) => this.onError(e))

    let allRolePermissions$: Observable<RolePermissionsMappings> = _store.select((s: AuthServiceStoreState) => {
      return s.auth.role_permissions
    })

    this.rolePermissions$ = allRolePermissions$.map(permissions => {
      return permissions[this.role.$key] || {}
    })
  }

  onSignedIn(value: SignInState) {
    if (value && value.state == SignInStates.signedIn) {
      this._store.dispatch(RoleActions.getRolePermissions.invoke.action())
    }
  }

  onAddRolePermission(rolePermission: RolePermission) {
    this._store.dispatch(RoleActions.grantPermissionToRole.invoke.action(rolePermission))
  }

  onRemoveRolePermission(rolePermission: RolePermission) {
    this._store.dispatch(RoleActions.revokePermissionFromRole.invoke.action(rolePermission))
  }

  onError(e: Error): void {
    console.error("RoleContainer", "onError", e)
  }
}

