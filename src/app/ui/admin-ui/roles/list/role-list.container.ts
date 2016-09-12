import {Component, ChangeDetectionStrategy} from '@angular/core'
import {Observable} from 'rxjs'
import {Store} from '@ngrx/store'
import {
  RoleActions,
  Role,
  AuthServiceStoreState,
  SignInState,
  SignInStates,
  RoleState
} from '../../../../services/auth-service'


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

  roles$: Observable<RoleState>

  constructor(private _store: Store<AuthServiceStoreState>) {
    _store.select((s: AuthServiceStoreState) => s.auth.transient.signInState).subscribe((v) => this.onSignedIn(v), (e) => this.onError(e))

    this.roles$ = _store.select((s: AuthServiceStoreState) => s.auth.roles)
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
    console.error("CurrentUserEffects", "onError", e)
  }
}

