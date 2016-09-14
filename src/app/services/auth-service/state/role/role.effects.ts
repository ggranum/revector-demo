import {Injectable, OnDestroy} from '@angular/core'
import {Store} from '@ngrx/store'
import {Actions, Effect} from '@ngrx/effects'
import {AngularFire} from 'angularfire2'
import {Observable} from 'rxjs'
import {AuthServiceStoreState, Role, RolePermission, MappedPermission, RolePermissionsMappings} from '../../interfaces'
import {RoleActions} from './role.actions'
import {RoleModel} from '../../models/role-model'
import {ObjMap, TypedAction, cleanFirebaseMap, Update} from '../../../../shared'


@Injectable()
export class RoleEffects implements OnDestroy {

  private _fbRoot: string = '/auth'

  constructor(private actions$: Actions, public store: Store<AuthServiceStoreState>, public firebase: AngularFire) {

  }

  //noinspection JSUnusedGlobalSymbols
  @Effect() getRoles$ = this.actions$
    .ofType(RoleActions.getRoles.invoke.type)
    .switchMap((action: TypedAction<Role>) => this.getRoles())

  //noinspection JSUnusedGlobalSymbols
  @Effect() addRole$ = this.actions$
    .ofType(RoleActions.addRole.invoke.type)
    .switchMap((action: TypedAction<Role>) => this.addRole(action.payload))

  //noinspection JSUnusedGlobalSymbols
  @Effect() updateRole$ = this.actions$
    .ofType(RoleActions.updateRole.invoke.type)
    .switchMap((action: TypedAction<Update<Role>>) => this.updateRole(action.payload))

  //noinspection JSUnusedGlobalSymbols
  @Effect() removeRole$ = this.actions$
    .ofType(RoleActions.removeRole.invoke.type)
    .switchMap((action: TypedAction<Role>) => this.removeRole(action.payload))

  //noinspection JSUnusedGlobalSymbols
  @Effect() getRolePermissions$ = this.actions$
    .ofType(RoleActions.getRolePermissions.invoke.type)
    .switchMap((action: TypedAction<RolePermissionsMappings>) => this.getRolePermissions())

  //noinspection JSUnusedGlobalSymbols
  @Effect() grantPermission$ = this.actions$
    .ofType(RoleActions.grantPermissionToRole.invoke.type)
    .switchMap((action: TypedAction<RolePermission>) => this.grantPermission(action.payload))

  //noinspection JSUnusedGlobalSymbols
  @Effect() revokePermission$ = this.actions$
    .ofType(RoleActions.revokePermissionFromRole.invoke.type)
    .switchMap((action: TypedAction<RolePermission>) => this.revokePermission(action.payload))

  getRoles() {
    let fbRoles = <Observable<any>>this.firebase.database.object(`${this._fbRoot}/roles`).first()
    fbRoles = fbRoles.map((v) => {
      let map = cleanFirebaseMap<Role>(v)
      Object.keys(map).forEach((key: string) => {
        map[key].name = key
      })
      return RoleActions.getRoles.fulfilled.action(map)
    })
    return fbRoles
  }

  addRole(role: Role) {
    let model = RoleModel.from(role)
    if (model.validate() === null) {
      let fbRole = this.firebase.database.object(`${this._fbRoot}/roles/${role.name}`)
      delete role.name
      let fbPromise = <Promise<any>>fbRole.set(role)
      fbPromise = fbPromise.then(() => {
        return RoleActions.addRole.fulfilled.action(role)
      }, (e) => {
        return RoleActions.addRole.failed.action(e)
      })
      return Observable.fromPromise(fbPromise)
    }
  }

  updateRole(update: Update<Role>) {
    let previous: Role = update.previous
    let current: Role = update.current
    let fbRole = this.firebase.database.object(`${this._fbRoot}/roles/${previous.name}`)
    let promise: Promise<any>

    if (previous.name === current.name) {
      delete current.name
      promise = <Promise<any>>fbRole.set(current)
      promise = promise.then(() => {
        return RoleActions.updateRole.fulfilled.action(update)
      }, (e) => {
        return RoleActions.updateRole.failed.action(e)
      })
    } else {
      promise = <Promise<any>>fbRole.remove()
      promise = promise.then(() => {
        let fbNewPerm = this.firebase.database.object(`${this._fbRoot}/roles/${current.name}`)
        delete current.name
        let newPromise = <Promise<any>>fbNewPerm.set(current)
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
    let fbPromise = <Promise<any>>this.firebase.database.object(`${this._fbRoot}/roles/${role.name}`).remove()
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
      let map = cleanFirebaseMap<{[permission_name: string]: MappedPermission}>(v)
      return RoleActions.getRolePermissions.fulfilled.action(map)
    })
    return fbRolePermissions
  }

  grantPermission(rolePermission: RolePermission) {
    let current: MappedPermission = null
    this.store.select((s: AuthServiceStoreState) => s.auth.role_permissions[rolePermission.role_name])
      .subscribe((rolePermissions: ObjMap<MappedPermission>) => {
        current = rolePermissions[rolePermission.permission_name]
      })
    let fbRolePermRef = this.firebase.database.object(`${this._fbRoot}/role_permissions/${rolePermission.role_name}/${rolePermission.permission_name}`)
    delete current.name
    let fbAddRolePromise = <Promise<any>>fbRolePermRef.set(current)

    fbAddRolePromise = fbAddRolePromise.then(() => {
      return RoleActions.grantPermissionToRole.fulfilled.action(rolePermission)
    }, (e) => {
      return RoleActions.grantPermissionToRole.failed.action(e)
    })
    return Observable.fromPromise(fbAddRolePromise)
  }

  revokePermission(rolePermission: RolePermission) {
    console.log("RoleEffects", "revokePermission", rolePermission)
    let fbRolePermRef = this.firebase.database.object(`${this._fbRoot}/role_permissions/${rolePermission.role_name}/${rolePermission.permission_name}`)
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

