import {Component, ChangeDetectionStrategy} from '@angular/core'
import {Observable} from 'rxjs'
import {Store} from '@ngrx/store'
import {
  UserActions,
  User,
  AuthServiceStoreState,
  SignInState,
  SignInStates,
  UserState,
  RoleState,
  PermissionState
} from '../../../../services/auth-service'


@Component({
  selector: 'rv-user-list',
  template: `<rv-user-list-component
  [usersObj]="users$ | async"
  [rolesObj]="roles$ | async"
  [permissionsObj]="permissions$ | async"
  (addUser)="onAddUser($event)"
  (userChange)="onUserChange($event)"
  (removeUser)="onRemoveUser($event)"
></rv-user-list-component>
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListContainer {

  users$: Observable<UserState>
  roles$: Observable<RoleState>
  permissions$: Observable<PermissionState>

  constructor(private _store: Store<AuthServiceStoreState>) {
    _store.select((s: AuthServiceStoreState) => s.auth.transient.signInState).subscribe((v) => this.onSignedIn(v), (e) => this.onError(e))

    this.users$ = _store.select((s: AuthServiceStoreState) => s.auth.users)
    this.roles$ = _store.select((s: AuthServiceStoreState) => s.auth.roles)
    this.permissions$ = _store.select((s: AuthServiceStoreState) => s.auth.permissions)
  }

  onSignedIn(value: SignInState) {
    if (value && value.state == SignInStates.signedIn) {
      this._store.dispatch(UserActions.getUsers.invoke.action())
    }
  }

  onAddUser(user: User) {
    this._store.dispatch(UserActions.addUser.invoke.action(user))
  }

  onUserChange(user: User) {
    this._store.dispatch(UserActions.updateUser.invoke.action(user))
  }

  onRemoveUser(user: User) {
    this._store.dispatch(UserActions.removeUser.invoke.action(user))
  }


  onError(e: Error): void {
    console.error("CurrentUserEffects", "onError", e)
  }
}

