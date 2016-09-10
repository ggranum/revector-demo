import {Injectable, OnDestroy} from '@angular/core'
import {Store} from '@ngrx/store'
import {AuthServiceStoreData, Permission} from '../../interfaces'
import {Actions, Effect} from '@ngrx/effects'
import {Observable} from 'rxjs'
import {PermissionActions} from './permission.actions'
import {AngularFire} from 'angularfire2'
import {TypedAction, cleanFirebaseMap} from '../../../../shared'
import {PermissionModel} from '../../models/permission-model'


@Injectable()
export class PermissionEffects implements OnDestroy {

  private _fbRoot: string = '/auth'

  constructor(private actions$: Actions, public store: Store<AuthServiceStoreData>, public firebase: AngularFire) {

  }

  @Effect() getPermissions$ = this.actions$
    .ofType(PermissionActions.getPermissions.invoke.type)
    .switchMap((action: TypedAction<Permission>) => this.getPermissions(action.payload))


  @Effect() addPermission$ = this.actions$
    .ofType(PermissionActions.addPermission.invoke.type)
    .switchMap((action: TypedAction<Permission>) => this.addPermission(action.payload))

  @Effect() updatePermission$ = this.actions$
    .ofType(PermissionActions.updatePermission.invoke.type)
    .switchMap((action: TypedAction<Permission>) => this.updatePermission(action.payload))

  @Effect() removePermission$ = this.actions$
    .ofType(PermissionActions.removePermission.invoke.type)
    .switchMap((action: TypedAction<Permission>) => this.removePermission(action.payload))


  onError(e: Error): void {
    console.error("AuthEffects", "onError", e)
  }

  getPermissions(payload: any) {
    let p = <Observable<any>>this.firebase.database.object(`${this._fbRoot}/permissions`)
    p = p.map((v) => {
      let map = cleanFirebaseMap<Permission>(v)
      Object.keys(map).forEach((key: string) => {
        map[key].uid = key
      })
      return PermissionActions.getPermissions.fulfilled.action(map)
    })
    return p
  }

  addPermission(permission: Permission) {
    let model = PermissionModel.from(permission)
    if(model.validate() === null){
      let x = this.firebase.database.object(`${this._fbRoot}/permissions/${permission.uid}`)
      let p = <Promise<any>>x.update(permission)
      p = p.then((reply) => {
        return PermissionActions.addPermission.fulfilled.action(permission)
      }, (e) => {
        return PermissionActions.addPermission.failed.action(e)
      })
      return Observable.fromPromise(p)
    }
  }

  updatePermission(permission: Permission) {
    let p = <Promise<any>>this.firebase.database.object(`${this._fbRoot}/permissions/${permission.uid}`).set(permission)
    p = p.then((reply) => {
      return PermissionActions.updatePermission.fulfilled.action(permission)
    }, (e) => {
      return PermissionActions.updatePermission.failed.action(e)
    })
    return Observable.fromPromise(p)
  }

  removePermission(permission: Permission) {
    console.log("PermissionEffects", "removePermission", permission)
    let p = <Promise<any>>this.firebase.database.object(`${this._fbRoot}/permissions/${permission.uid}`).remove()
    p = p.then((reply) => {
      return PermissionActions.removePermission.fulfilled.action(permission)
    }, (e) => {
      return PermissionActions.removePermission.failed.action(e)
    })
    return Observable.fromPromise(p)
  }



  public ngOnDestroy(): void {
  }

}

