import {Injectable, OnDestroy} from '@angular/core'
import {Store} from '@ngrx/store'
import {Actions, Effect} from '@ngrx/effects'
import {AngularFire} from 'angularfire2'
import {Observable} from 'rxjs'
import {AuthStoreState, Role, RolePermission, PermissionGrant, RolesHavePermissionGrantsRelation} from '../../interfaces'
import {RoleActions} from './role.actions'
import {ObjMap, TypedAction, cleanFirebaseMap, Update} from '@revector/shared'


@Injectable()
export class RoleEffects implements OnDestroy {

  private _fbRoot: string = '/auth'

  // noinspection JSUnusedGlobalSymbols
  @Effect() getRoles$ = this.actions$
    .ofType(RoleActions.getRoles.invoke.type)
    .switchMap((action: TypedAction<Role>) => this.getRoles())

  // noinspection JSUnusedGlobalSymbols
  @Effect() addRole$ = this.actions$
    .ofType(RoleActions.addRole.invoke.type)
    .switchMap((action: TypedAction<Role>) => this.addRole(action.payload))

  // noinspection JSUnusedGlobalSymbols
  @Effect() updateRole$ = this.actions$
    .ofType(RoleActions.updateRole.invoke.type)
    .switchMap((action: TypedAction<Update<Role>>) => this.updateRole(action.payload))

  // noinspection JSUnusedGlobalSymbols
  @Effect() removeRole$ = this.actions$
    .ofType(RoleActions.removeRole.invoke.type)
    .switchMap((action: TypedAction<Role>) => this.removeRole(action.payload))

  // noinspection JSUnusedGlobalSymbols
  @Effect() getRolePermissions$ = this.actions$
    .ofType(RoleActions.getRolePermissions.invoke.type)
    .switchMap((action: TypedAction<RolesHavePermissionGrantsRelation>) => this.getRolePermissions())

  // noinspection JSUnusedGlobalSymbols
  @Effect() grantPermission$ = this.actions$
    .ofType(RoleActions.grantPermissionToRole.invoke.type)
    .switchMap((action: TypedAction<RolePermission>) => this.grantPermission(action.payload))

  // noinspection JSUnusedGlobalSymbols
  @Effect() revokePermission$ = this.actions$
    .ofType(RoleActions.revokePermissionFromRole.invoke.type)
    .switchMap((action: TypedAction<RolePermission>) => this.revokePermission(action.payload))

  constructor(private actions$: Actions, public store: Store<AuthStoreState>, public firebase: AngularFire) {  }

  toFirebaseValue(value: Role): Role {
    return Object.assign({}, value)
  }

  mappedPermissionToFirebase(value: PermissionGrant): PermissionGrant {
    let result: PermissionGrant = Object.assign({}, value)
    if (value && value.roles) {
      result.roles = Object.assign({}, value.roles)
    }
    return result
  }

  getRoles() {
    let fbRoles = <Observable<any>>this.firebase.database.object(`${this._fbRoot}/roles`).first()
    fbRoles = fbRoles.map((roleMap: ObjMap<Role>) => {
      delete roleMap['$key']
      delete roleMap['$exists']
      Object.keys(roleMap).forEach((key: string) => {
        roleMap[key].$key = key
      })
      return RoleActions.getRoles.fulfilled.action(roleMap)
    })
    return fbRoles
  }

  addRole(role: Role) {
    let fireValue: Role = {
      description: role.description
    }
    let fbRole = this.firebase.database.object(`${this._fbRoot}/roles/${role.$key}`)
    let fbPromise = <Promise<any>>fbRole.set(fireValue)
    fbPromise = fbPromise.then(() => {
      return RoleActions.addRole.fulfilled.action(role)
    }, (e) => {
      return RoleActions.addRole.failed.action(e)
    })
    return Observable.fromPromise(fbPromise)
  }

  updateRole(update: Update<Role>) {
    let previous: Role = update.previous
    let current: Role = update.current
    let fireValue = this.toFirebaseValue(current)
    let fbRole = this.firebase.database.object(`${this._fbRoot}/roles/${previous.$key}`)
    let promise: Promise<any>

    if (previous.$key === current.$key) {
      promise = <Promise<any>>fbRole.set(fireValue)
      promise = promise.then(() => {
        return RoleActions.updateRole.fulfilled.action(update)
      }, (e) => {
        return RoleActions.updateRole.failed.action(e)
      })
    } else {
      promise = <Promise<any>>fbRole.remove()
      promise = promise.then(() => {
        let fbNewPerm = this.firebase.database.object(`${this._fbRoot}/roles/${current.$key}`)
        let newPromise = <Promise<any>>fbNewPerm.set(fireValue)
        return newPromise.then(() => {
          return RoleActions.updateRole.fulfilled.action(update)
        })
      }, (e) => {
        return RoleActions.updateRole.failed.action(e)
      })
    }
    return Observable.fromPromise(promise)
  }

  removeRole(role: Role) {
    let fbPromise = <Promise<any>>this.firebase.database.object(`${this._fbRoot}/roles/${role.$key}`).remove()
    fbPromise = fbPromise.then(() => {
      return RoleActions.removeRole.fulfilled.action(role)
    }, (e) => {
      return RoleActions.removeRole.failed.action(e)
    })
    return Observable.fromPromise(fbPromise)
  }

  getRolePermissions() {
    let fbRolePermissions = <Observable<any>>this.firebase.database.object(`${this._fbRoot}/role_permissions`).first()
    fbRolePermissions = fbRolePermissions.map((v) => {
      let map = cleanFirebaseMap<{[permission_name: string]: PermissionGrant}>(v)
      return RoleActions.getRolePermissions.fulfilled.action(map)
    })
    return fbRolePermissions
  }

  grantPermission(rolePermission: RolePermission) {
    let fireValue: PermissionGrant
    this.store.select((s: AuthStoreState) => s.auth.role_permissions[rolePermission.role_key])
      .subscribe((rolePermissions: ObjMap<PermissionGrant>) => {
        let current: PermissionGrant = rolePermissions[rolePermission.permission_key]
        fireValue = this.mappedPermissionToFirebase(current)
      })
    let path = `${this._fbRoot}/role_permissions/${rolePermission.role_key}/${rolePermission.permission_key}`
    let fbRolePermRef = this.firebase.database.object(path)
    let fbAddRolePromise = <Promise<any>>fbRolePermRef.set(fireValue)

    fbAddRolePromise = fbAddRolePromise.then(() => {
      return RoleActions.grantPermissionToRole.fulfilled.action(rolePermission)
    }, (e) => {
      return RoleActions.grantPermissionToRole.failed.action(e)
    })
    return Observable.fromPromise(fbAddRolePromise)
  }

  revokePermission(rolePermission: RolePermission) {
    let path = `${this._fbRoot}/role_permissions/${rolePermission.role_key}/${rolePermission.permission_key}`
    let fbRolePermRef = this.firebase.database.object(path)
    let fbPromise = <Promise<any>>fbRolePermRef.remove()
    fbPromise = fbPromise.then(() => {
      return RoleActions.revokePermissionFromRole.fulfilled.action(rolePermission)
    }, (e) => {
      return RoleActions.revokePermissionFromRole.failed.action(e)
    })
    return Observable.fromPromise(fbPromise)
  }

  public ngOnDestroy(): void {
  }

}

