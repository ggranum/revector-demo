import {
  Component,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  ViewEncapsulation
} from '@angular/core'
import {Observable} from 'rxjs'
import {Store} from '@ngrx/store'
import {
  UserActions,
  User,
  UserRole,
  AuthServiceStoreState,
  SignInState,
  SignInStates,
  UserRolesMappings,
  UserPermissionsMappings,
  MappedPermission,
  Role,
  Permission,
  UserPermission
} from '@revector/auth-service'
import {ObjMap} from '@revector/shared'


@Component({
  selector: 'rv-user-list-item',
  template: ` 
 <rv-user-list-item-component
               flex layout="row" layout-align="start"
               [user]="user"
               [roles]="roles"
               [permissions]="permissions"
               [userRoles]="userRoles$ | async"
               [userPermissions]="userPermissions$ | async"
               (change)="change.emit($event)"
               (addUserRole)="onAddUserRole($event)"
               (removeUserRole)="onRemoveUserRole($event)"
               (addUserPermission)="onAddUserPermission($event)"
               (removeUserPermission)="onRemoveUserPermission($event)"
               (removeUser)="removeUser.emit($event)"
               (focus)="focus.emit($event)"
               (blur)="blur.emit($event)"
      ></rv-user-list-item-component>
`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class UserListItemContainer {

  @Input() user: User
  @Input() roles: Role[]
  @Input() permissions: Permission[]

  @Output() change: Observable<User> = new EventEmitter<User>(false)
  @Output() removeUser: EventEmitter<User> = new EventEmitter<User>(false)


  @Output() focus: EventEmitter<Event> = new EventEmitter<Event>(false)
  @Output() blur: EventEmitter<Event> = new EventEmitter<Event>(false)

  userRoles$: Observable<{[role_uid: string]: boolean}>
  userPermissions$: Observable<ObjMap<MappedPermission>>


  constructor(private _store: Store<AuthServiceStoreState>) {
    _store.select((s: AuthServiceStoreState) => s.auth.transient.signInState).subscribe((v) => this.onSignedIn(v), (e) => this.onError(e))

    this.userRoles$ = _store.select((s: AuthServiceStoreState) => {
      return s.auth.user_roles ? s.auth.user_roles[this.user.uid] || {} : {}
    })

    this.userPermissions$ = _store.select((s: AuthServiceStoreState) => {
      return s.auth.user_permissions ? s.auth.user_permissions[this.user.uid] || {} : {}
    })
  }

  onSignedIn(value: SignInState) {
    if (value && value.state == SignInStates.signedIn) {
      this._store.dispatch(UserActions.getUserRoles.invoke.action())
      this._store.dispatch(UserActions.getUserPermissions.invoke.action())
    }
  }

  onAddUserRole(userRole: UserRole) {
    this._store.dispatch(UserActions.addUserToRole.invoke.action(userRole))
  }

  onRemoveUserRole(userRole: UserRole) {
    this._store.dispatch(UserActions.removeUserFromRole.invoke.action(userRole))
  }

  onAddUserPermission(userPermission: UserPermission) {
    this._store.dispatch(UserActions.grantPermissionToUser.invoke.action(userPermission))
  }

  onRemoveUserPermission(userPermission: UserPermission) {
    this._store.dispatch(UserActions.revokePermissionFromUser.invoke.action(userPermission))
  }

  onError(e: Error): void {
    console.error("UserContainer", "onError", e)
  }
}

