import {
  Injectable,
  OnDestroy
} from '@angular/core'
import {Store} from '@ngrx/store'
import {
  AuthServiceStoreState,
  Permission,
  MappedPermission
} from '../../interfaces'
import {
  Actions,
  Effect
} from '@ngrx/effects'
import {Observable} from 'rxjs'
import {PermissionActions} from './permission.actions'
import {AngularFire} from 'angularfire2'
import {
  TypedAction,
  ObjMap,
  Update
} from '@revector/shared'


@Injectable()
export class PermissionEffects implements OnDestroy {

  private _fbRoot: string = '/auth'

  // noinspection JSUnusedGlobalSymbols
  @Effect() getPermissions$ = this.actions$
    .ofType(PermissionActions.getPermissions.invoke.type)
    .switchMap((action: TypedAction<Permission>) => this.getPermissions())

  // noinspection JSUnusedGlobalSymbols
  @Effect() addPermission$ = this.actions$
    .ofType(PermissionActions.addPermission.invoke.type)
    .switchMap((action: TypedAction<Permission>) => this.addPermission(action.payload))

  // noinspection JSUnusedGlobalSymbols
  @Effect() updatePermission$ = this.actions$
    .ofType(PermissionActions.updatePermission.invoke.type)
    .switchMap((action: TypedAction<Update<Permission>>) => this.updatePermission(action.payload))

  // noinspection JSUnusedGlobalSymbols
  @Effect() removePermission$ = this.actions$
    .ofType(PermissionActions.removePermission.invoke.type)
    .switchMap((action: TypedAction<Permission>) => this.removePermission(action.payload))

  constructor(private actions$: Actions, public store: Store<AuthServiceStoreState>, public firebase: AngularFire) {
  }

  toFirebaseValue(value: Permission): Permission {
    return {
      description: value.description,
      orderIndex: value.orderIndex,
    }
  }

  getPermissions() {
    let fbPermissions = <Observable<any>>this.firebase.database.object(`${this._fbRoot}/permissions`).first()
    fbPermissions = fbPermissions.map((permissionsMap: ObjMap<MappedPermission>) => {
      delete permissionsMap['$key']
      delete permissionsMap['$exists']
      Object.keys(permissionsMap).forEach((key: string) => {
        permissionsMap[key].$key = key
      })
      return PermissionActions.getPermissions.fulfilled.action(permissionsMap)
    })
    return fbPermissions
  }

  addPermission(permission: Permission) {
    let fireValue = this.toFirebaseValue(permission)
    let fbPermission = this.firebase.database.object(`${this._fbRoot}/permissions/${permission.$key}`)

    let fbPromise = <Promise<any>>fbPermission.set(fireValue)
    fbPromise = fbPromise.then(() => {
      return PermissionActions.addPermission.fulfilled.action(permission)
    }, (e) => {
      return PermissionActions.addPermission.failed.action(e)
    })
    return Observable.fromPromise(fbPromise)
  }

  updatePermission(update: Update<Permission>) {
    let previous: Permission = update.previous
    let current: Permission = update.current
    let fireValue = this.toFirebaseValue(current)
    let fbPermission = this.firebase.database.object(`${this._fbRoot}/permissions/${previous.$key}`)
    let promise: Promise<any>

    if (previous.$key === current.$key) {
      promise = <Promise<any>>fbPermission.set(fireValue)
      promise = promise.then(() => {
        return PermissionActions.updatePermission.fulfilled.action(update)
      }, (e) => {
        return PermissionActions.updatePermission.failed.action(e)
      })
    } else {
      promise = <Promise<any>>fbPermission.remove()
      promise = promise.then(() => {
        let fbNewPerm = this.firebase.database.object(`${this._fbRoot}/permissions/${current.$key}`)
        let newPromise = <Promise<any>>fbNewPerm.set(fireValue)
        return newPromise.then(() => {
          return PermissionActions.updatePermission.fulfilled.action(update)
        })
      }, (e) => {
        return PermissionActions.updatePermission.failed.action(e)
      })
    }
    return Observable.fromPromise(promise)
  }

  removePermission(permission: Permission) {
    let fbPromise = <Promise<any>>this.firebase.database.object(`${this._fbRoot}/permissions/${permission.$key}`).remove()
    fbPromise = fbPromise.then(() => {
      return PermissionActions.removePermission.fulfilled.action(permission)
    }, (e) => {
      return PermissionActions.removePermission.failed.action(e)
    })
    return Observable.fromPromise(fbPromise)
  }


  public ngOnDestroy(): void {
  }

}

