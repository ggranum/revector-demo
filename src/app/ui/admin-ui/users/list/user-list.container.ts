import {Component, ChangeDetectionStrategy} from '@angular/core'
import {Observable} from 'rxjs'
import {Store} from '@ngrx/store'
import {
  UserActions,
  User,
  AuthServiceStoreData,
  SignInState,
  SignInStates
} from '../../../../services/auth-service/index'
import {ObjMap} from '../../../../shared'


@Component({
  selector: 'rv-user-list',
  template: ` 
 <rv-user-list-component [usersObj]="users$ | async"
 (addUser)="onAddUser($event)"
 (userChange)="onUserChange($event)"
 (removeUser)="onRemoveUser($event)"
 ></rv-user-list-component>
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListContainer {

  users$: Observable<ObjMap<User>>

  constructor(private _store: Store<AuthServiceStoreData>) {
    _store.select((s: AuthServiceStoreData) => s.auth.transient.signInState).subscribe((v) => this.onSignedIn(v), (e) => this.onError(e))

    this.users$ = _store.select((s: AuthServiceStoreData) => s.auth.users)
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
    console.error("AuthEffects", "onError", e)
  }
}

