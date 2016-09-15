import {Injectable, OnDestroy} from '@angular/core'
import {Store} from '@ngrx/store'
import {AngularFire} from 'angularfire2'
import {Actions, Effect} from '@ngrx/effects'
import {Observable} from 'rxjs'
import {UserActions} from './user.actions'
import {
  AuthServiceStoreState, User, UserRole, UserRolesMappings, UserPermission,
  UserPermissionsMappings, MappedPermission
} from '../../interfaces'
import {TypedAction, cleanFirebaseMap, ObjMap} from '../../../../shared'
import {UserModel} from '../../models/user-model'


@Injectable()
export class UserEffects implements OnDestroy {

  private _fbRoot: string = '/auth'

  constructor(private actions$: Actions, public store: Store<AuthServiceStoreState>, public firebase: AngularFire) { }

  //noinspection JSUnusedGlobalSymbols
  @Effect() getUsers$ = this.actions$
    .ofType(UserActions.getUsers.invoke.type)
    .switchMap((action: TypedAction<User>) => this.getUsers())

  //noinspection JSUnusedGlobalSymbols
  @Effect() addUser$ = this.actions$
    .ofType(UserActions.addUser.invoke.type)
    .switchMap((action: TypedAction<User>) => this.addUser(action.payload))

  //noinspection JSUnusedGlobalSymbols
  @Effect() updateUser$ = this.actions$
    .ofType(UserActions.updateUser.invoke.type)
    .switchMap((action: TypedAction<User>) => this.updateUser(action.payload))

  //noinspection JSUnusedGlobalSymbols
  @Effect() removeUser$ = this.actions$
    .ofType(UserActions.removeUser.invoke.type)
    .switchMap((action: TypedAction<User>) => this.removeUser(action.payload))

  //noinspection JSUnusedGlobalSymbols
  @Effect() getUserRoles$ = this.actions$
    .ofType(UserActions.getUserRoles.invoke.type)
    .switchMap((action: TypedAction<UserRolesMappings>) => this.getUserRoles())

  //noinspection JSUnusedGlobalSymbols
  @Effect() addUserToRole$ = this.actions$
    .ofType(UserActions.addUserToRole.invoke.type)
    .switchMap((action: TypedAction<UserRole>) => this.addUserToRole(action.payload))

  //noinspection JSUnusedGlobalSymbols
  @Effect() removeUserFromRole$ = this.actions$
    .ofType(UserActions.removeUserFromRole.invoke.type)
    .switchMap((action: TypedAction<UserRole>) => this.removeUserFromRole(action.payload))

  //noinspection JSUnusedGlobalSymbols
  @Effect() getUserPermissions$ = this.actions$
    .ofType(UserActions.getUserPermissions.invoke.type)
    .switchMap((action: TypedAction<UserPermissionsMappings>) => this.getUserPermissions())

  //noinspection JSUnusedGlobalSymbols
  @Effect() grantPermission$ = this.actions$
    .ofType(UserActions.grantPermissionToUser.invoke.type)
    .switchMap((action: TypedAction<UserPermission>) => this.grantPermission(action.payload))

  //noinspection JSUnusedGlobalSymbols
  @Effect() revokePermission$ = this.actions$
    .ofType(UserActions.revokePermissionFromUser.invoke.type)
    .switchMap((action: TypedAction<UserPermission>) => this.revokePermission(action.payload))

  getUsers() {
    let fbUsers = <Observable<any>>this.firebase.database.object(`${this._fbRoot}/users`).first()
    fbUsers = fbUsers.map((v) => {
      let map = cleanFirebaseMap<User>(v)
      Object.keys(map).forEach((key: string) => {
        map[key].uid = key
      })
      return UserActions.getUsers.fulfilled.action(map)
    })
    return fbUsers
  }

  getUserRoles() {
    let fbUserRoles = <Observable<any>>this.firebase.database.object(`${this._fbRoot}/user_roles`).first()
    fbUserRoles = fbUserRoles.map((v) => {
      let map = cleanFirebaseMap<{[key: string]: boolean}>(v)
      return UserActions.getUserRoles.fulfilled.action(map)
    })
    return fbUserRoles
  }

  addUser(user: User) {
    let model = UserModel.from(user)
    if (model.validate() === null) {
      let fbUser = this.firebase.database.object(`${this._fbRoot}/users/${user.uid}`)
      let fbPromise = <Promise<any>>fbUser.update(user)
      fbPromise = fbPromise.then(() => {
        return UserActions.addUser.fulfilled.action(user)
      }, (e) => {
        return UserActions.addUser.failed.action(e)
      })
      return Observable.fromPromise(fbPromise)
    }
  }

  updateUser(user: User) {
    let fbPromise = <Promise<any>>this.firebase.database.object(`${this._fbRoot}/users/${user.uid}`).set(user)
    fbPromise = fbPromise.then(() => {
      return UserActions.updateUser.fulfilled.action(user)
    }, (e) => {
      return UserActions.updateUser.failed.action(e)
    })
    return Observable.fromPromise(fbPromise)
  }

  removeUser(user: User) {
    let fbPromise = <Promise<any>>this.firebase.database.object(`${this._fbRoot}/users/${user.uid}`).remove()
    fbPromise = fbPromise.then(() => {
      return UserActions.removeUser.fulfilled.action(user)
    }, (e) => {
      return UserActions.removeUser.failed.action(e)
    })
    return Observable.fromPromise(fbPromise)
  }

  addUserToRole(userRole: UserRole): Observable<TypedAction<UserRole>> {
    let fbUserRoleRef = this.firebase.database.object(`${this._fbRoot}/user_roles/${userRole.user_uid}/${userRole.role_name}`)
    let fbPromise = <Promise<any>>fbUserRoleRef.set(true)
    return Observable.fromPromise(fbPromise).mergeMap(() => {
      return this.addUserPermissionsForRole(userRole)
    })
  }

  addUserPermissionsForRole(userRole: UserRole) {
    let userPermsPath = `${this._fbRoot}/user_permissions/${userRole.user_uid}`
    let fbRolePermissions = this.firebase.database.list(`${this._fbRoot}/role_permissions/${userRole.role_name}`)
    return fbRolePermissions.mergeMap((list: MappedPermission[]) => {
      return Observable.of(...list)
    }).mergeMap((perm: MappedPermission) => {
      let promise = <Promise<any>>this.firebase.database.object(`${userPermsPath}/${perm.$key}/roles/${userRole.role_name}`).set(true)
      return Observable.fromPromise(promise)
    }).mergeMap((foo) => {
      return Observable.of(UserActions.addUserToRole.fulfilled.action(userRole))
    })
  }

  removeUserFromRole(userRole: UserRole): Observable<TypedAction<UserRole>> {
    let fbUesrRole = this.firebase.database.object(`${this._fbRoot}/user_roles/${userRole.user_uid}/${userRole.role_name}`)
    let fbPromise = <Promise<any>>fbUesrRole.remove()
    return Observable.fromPromise(fbPromise).mergeMap(() => {
      return this.removeUserPermissionsForRole(userRole)
    })
  }

  removeUserPermissionsForRole(userRole: UserRole): Observable<TypedAction<UserRole>> {
    let userPermsPath = `${this._fbRoot}/user_permissions/${userRole.user_uid}`
    let fbRolePermissions = this.firebase.database.list(`${this._fbRoot}/role_permissions/${userRole.role_name}`)
    return fbRolePermissions.mergeMap((list: MappedPermission[]) => {
      return Observable.of(...list)
    }).mergeMap((perm: MappedPermission) => {
      let promise = <Promise<any>>this.firebase.database.object(`${userPermsPath}/${perm.$key}/roles/${userRole.role_name}`).remove()
      return Observable.fromPromise(promise)
    }).mergeMap((foo) => {
      return Observable.of(UserActions.removeUserFromRole.fulfilled.action(userRole))
    })

  }

  getUserPermissions() {
    let fbUserPermissions = <Observable<any>>this.firebase.database.object(`${this._fbRoot}/user_permissions`).first()
    fbUserPermissions = fbUserPermissions.map((v) => {
      let map = cleanFirebaseMap<{[permission_name: string]: MappedPermission}>(v)
      return UserActions.getUserPermissions.fulfilled.action(map)
    })
    return fbUserPermissions
  }

  grantPermission(userPermission: UserPermission) {
    let current: MappedPermission = null
    this.store.select((s: AuthServiceStoreState) => s.auth.user_permissions[userPermission.user_uid])
      .subscribe((userPermissions: ObjMap<MappedPermission>) => {
        current = userPermissions[userPermission.permission_name]
      })
    let fbUserPermRef = this.firebase.database.object(`${this._fbRoot}/user_permissions/${userPermission.user_uid}/${userPermission.permission_name}`)

    delete current.name
    let fbAddRolePromise = <Promise<any>>fbUserPermRef.set(current)

    fbAddRolePromise = fbAddRolePromise.then(() => {
      return UserActions.grantPermissionToUser.fulfilled.action(userPermission)
    }, (e) => {
      return UserActions.grantPermissionToUser.failed.action(e)
    })
    return Observable.fromPromise(fbAddRolePromise)
  }

  revokePermission(userPermission: UserPermission) {
    let fbUserPermRef = this.firebase.database.object(`${this._fbRoot}/user_permissions/${userPermission.user_uid}/${userPermission.permission_name}`)
    let fbPromise = <Promise<any>>fbUserPermRef.remove()
    fbPromise = fbPromise.then(() => {
      return UserActions.revokePermissionFromUser.fulfilled.action(userPermission)
    }, (e) => {
      return UserActions.revokePermissionFromUser.failed.action(e)
    })
    return Observable.fromPromise(fbPromise)
  }

  public ngOnDestroy(): void {
  }

}

