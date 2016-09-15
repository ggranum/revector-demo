import {Injectable, OnDestroy} from '@angular/core'
import {Store} from '@ngrx/store'
import {AuthServiceStoreState, Permission} from '../../interfaces'
import {Actions, Effect} from '@ngrx/effects'
import {Observable} from 'rxjs'
import {PermissionActions} from './permission.actions'
import {AngularFire} from 'angularfire2'
import {TypedAction, cleanFirebaseMap, Update} from '../../../../shared'
import {PermissionModel} from '../../models/permission-model'


@Injectable()
export class PermissionEffects implements OnDestroy {

  private _fbRoot: string = '/auth'

  constructor(private actions$: Actions, public store: Store<AuthServiceStoreState>, public firebase: AngularFire) {

  }

  //noinspection JSUnusedGlobalSymbols
  @Effect() getPermissions$ = this.actions$
    .ofType(PermissionActions.getPermissions.invoke.type)
    .switchMap((action: TypedAction<Permission>) => this.getPermissions())

  //noinspection JSUnusedGlobalSymbols
  @Effect() addPermission$ = this.actions$
    .ofType(PermissionActions.addPermission.invoke.type)
    .switchMap((action: TypedAction<Permission>) => this.addPermission(action.payload))

  //noinspection JSUnusedGlobalSymbols
  @Effect() updatePermission$ = this.actions$
    .ofType(PermissionActions.updatePermission.invoke.type)
    .switchMap((action: TypedAction<Update<Permission>>) => this.updatePermission(action.payload))

  //noinspection JSUnusedGlobalSymbols
  @Effect() removePermission$ = this.actions$
    .ofType(PermissionActions.removePermission.invoke.type)
    .switchMap((action: TypedAction<Permission>) => this.removePermission(action.payload))

  getPermissions() {
    let fbPermissions = <Observable<any>>this.firebase.database.object(`${this._fbRoot}/permissions`).first()
    fbPermissions = fbPermissions.map((v) => {
      let map = cleanFirebaseMap<Permission>(v, true)
      Object.keys(map).forEach((key: string) => {
        map[key].name = key
      })
      return PermissionActions.getPermissions.fulfilled.action(map)
    })
    return fbPermissions
  }

  addPermission(permission: Permission) {
    let model = PermissionModel.from(permission)
    if (model.validate() === null) {
      let fbPermission = this.firebase.database.object(`${this._fbRoot}/permissions/${permission.name}`)
      delete permission.name
      let fbPromise = <Promise<any>>fbPermission.set(permission)
      fbPromise = fbPromise.then(() => {
        return PermissionActions.addPermission.fulfilled.action(permission)
      }, (e) => {
        return PermissionActions.addPermission.failed.action(e)
      })
      return Observable.fromPromise(fbPromise)
    }
  }

  updatePermission(update: Update<Permission>) {
    let previous: Permission = update.previous
    let current: Permission = update.current
    let fbPermission = this.firebase.database.object(`${this._fbRoot}/permissions/${previous.name}`)
    let promise: Promise<any>

    if (previous.name === current.name) {
      delete current.name
      promise = <Promise<any>>fbPermission.set(current)
      promise = promise.then(() => {
        return PermissionActions.updatePermission.fulfilled.action(update)
      }, (e) => {
        return PermissionActions.updatePermission.failed.action(e)
      })
    } else {
      promise = <Promise<any>>fbPermission.remove()
      promise = promise.then(() => {
        let fbNewPerm = this.firebase.database.object(`${this._fbRoot}/permissions/${current.name}`)
        delete current.name
        let newPromise = <Promise<any>>fbNewPerm.set(current)
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
    let fbPromise = <Promise<any>>this.firebase.database.object(`${this._fbRoot}/permissions/${permission.name}`).remove()
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

