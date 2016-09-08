import {Injectable, OnDestroy} from '@angular/core'
import {Store} from '@ngrx/store'
import {AuthServiceStoreData, Role} from '../../interfaces'
import {Actions, Effect} from '@ngrx/effects'
import {Observable} from 'rxjs'
import {RoleActions, TypedAction} from './role.actions'
import {AngularFire} from 'angularfire2'
import {cleanFirebaseMap} from '../../../admin-ui/core-util'


@Injectable()
export class RoleEffects implements OnDestroy {

  private _fbRoot:string = '/auth'


  constructor(private actions$: Actions, public store: Store<AuthServiceStoreData>, public firebase: AngularFire) {

  }

  @Effect() getRoles$ = this.actions$
    .ofType(RoleActions.getRoles.invoke.type)
    .switchMap((action: TypedAction<Role>) => this.getRoles(action.payload))


  @Effect() addRole$ = this.actions$
    .ofType(RoleActions.addRole.invoke.type)
    .switchMap((action: TypedAction<Role>) => this.addRole(action.payload))

  onError(e: Error): void {
    console.error("AuthEffects", "onError", e)
  }

  getRoles(payload: any) {
    let p = <Observable<any>>this.firebase.database.object(`${this._fbRoot}/roles`)
    p = p.map((v) => {
      let map = cleanFirebaseMap<Role>(v)
      return RoleActions.getRoles.fulfilled.action(map)
    })
    return p
  }

  addRole(payload: Role) {
    let p = <Promise<any>>this.firebase.database.list(`${this._fbRoot}/roles`).push(payload)

    p = p.then((reply) => {
      console.log("addRole", reply)
      let role:Role = payload
      role.uid = reply.key
      return RoleActions.addRole.fulfilled.action(role)
    }, (e)=>{
      return RoleActions.addRole.failed.action(e)
    })
    return Observable.fromPromise(p)
  }


  public ngOnDestroy(): void {
  }

}

