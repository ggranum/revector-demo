import {Injectable, OnDestroy} from '@angular/core'
import {Store} from '@ngrx/store'
import {AuthServiceStoreData, Role} from '../../interfaces'
import {Actions, Effect} from '@ngrx/effects'
import {Observable} from 'rxjs'
import {RoleActions} from './role.actions'
import {AngularFire} from 'angularfire2'
import {TypedAction, cleanFirebaseMap} from '../../../../shared'
import {RoleModel} from '../../models/role-model'


@Injectable()
export class RoleEffects implements OnDestroy {

  private _fbRoot: string = '/auth'

  constructor(private actions$: Actions, public store: Store<AuthServiceStoreData>, public firebase: AngularFire) {

  }

  @Effect() getRoles$ = this.actions$
    .ofType(RoleActions.getRoles.invoke.type)
    .switchMap((action: TypedAction<Role>) => this.getRoles(action.payload))


  @Effect() addRole$ = this.actions$
    .ofType(RoleActions.addRole.invoke.type)
    .switchMap((action: TypedAction<Role>) => this.addRole(action.payload))

  @Effect() updateRole$ = this.actions$
    .ofType(RoleActions.updateRole.invoke.type)
    .switchMap((action: TypedAction<Role>) => this.updateRole(action.payload))

  @Effect() removeRole$ = this.actions$
    .ofType(RoleActions.removeRole.invoke.type)
    .switchMap((action: TypedAction<Role>) => this.removeRole(action.payload))


  onError(e: Error): void {
    console.error("AuthEffects", "onError", e)
  }

  getRoles(payload: any) {
    let p = <Observable<any>>this.firebase.database.object(`${this._fbRoot}/roles`)
    p = p.map((v) => {
      let map = cleanFirebaseMap<Role>(v)
      Object.keys(map).forEach((key: string) => {
        map[key].uid = key
      })
      return RoleActions.getRoles.fulfilled.action(map)
    })
    return p
  }

  addRole(role: Role) {
    let model = RoleModel.from(role)
    if(model.validate() === null){
      let x = this.firebase.database.object(`${this._fbRoot}/roles/${role.uid}`)
      let p = <Promise<any>>x.update(role)
      p = p.then((reply) => {
        return RoleActions.addRole.fulfilled.action(role)
      }, (e) => {
        return RoleActions.addRole.failed.action(e)
      })
      return Observable.fromPromise(p)
    }
  }

  updateRole(role: Role) {
    let p = <Promise<any>>this.firebase.database.object(`${this._fbRoot}/roles/${role.uid}`).set(role)
    p = p.then((reply) => {
      return RoleActions.updateRole.fulfilled.action(role)
    }, (e) => {
      return RoleActions.updateRole.failed.action(e)
    })
    return Observable.fromPromise(p)
  }

  removeRole(role: Role) {
    console.log("RoleEffects", "removeRole", role)
    let p = <Promise<any>>this.firebase.database.object(`${this._fbRoot}/roles/${role.uid}`).remove()
    p = p.then((reply) => {
      return RoleActions.removeRole.fulfilled.action(role)
    }, (e) => {
      return RoleActions.removeRole.failed.action(e)
    })
    return Observable.fromPromise(p)
  }



  public ngOnDestroy(): void {
  }

}

