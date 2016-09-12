import {Injectable, OnDestroy} from '@angular/core'
import {Store} from '@ngrx/store'
import {AngularFire} from 'angularfire2'
import {Actions, Effect} from '@ngrx/effects'
import {Observable} from 'rxjs'
import {UserActions} from './user.actions'
import {AuthServiceStoreState, User} from '../../interfaces'
import {TypedAction, cleanFirebaseMap} from '../../../../shared'
import {UserModel} from '../../models/user-model'


@Injectable()
export class UserEffects implements OnDestroy {

  private _fbRoot: string = '/auth'

  constructor(private actions$: Actions, public store: Store<AuthServiceStoreState>, public firebase: AngularFire) {

  }

  @Effect() getUsers$ = this.actions$
    .ofType(UserActions.getUsers.invoke.type)
    .switchMap((action: TypedAction<User>) => this.getUsers(action.payload))


  @Effect() addUser$ = this.actions$
    .ofType(UserActions.addUser.invoke.type)
    .switchMap((action: TypedAction<User>) => this.addUser(action.payload))

  @Effect() updateUser$ = this.actions$
    .ofType(UserActions.updateUser.invoke.type)
    .switchMap((action: TypedAction<User>) => this.updateUser(action.payload))

  @Effect() removeUser$ = this.actions$
    .ofType(UserActions.removeUser.invoke.type)
    .switchMap((action: TypedAction<User>) => this.removeUser(action.payload))


  onError(e: Error): void {
    console.error("CurrentUserEffects", "onError", e)
  }

  getUsers(payload: any) {
    let p = <Observable<any>>this.firebase.database.object(`${this._fbRoot}/users`)
    p = p.map((v) => {
      let map = cleanFirebaseMap<User>(v)
      Object.keys(map).forEach((key: string) => {
        map[key].uid = key
      })
      return UserActions.getUsers.fulfilled.action(map)
    })
    return p
  }

  addUser(user: User) {
    let model = UserModel.from(user)
    if(model.validate() === null){
      let x = this.firebase.database.object(`${this._fbRoot}/users/${user.uid}`)
      let p = <Promise<any>>x.update(user)
      p = p.then((reply) => {
        return UserActions.addUser.fulfilled.action(user)
      }, (e) => {
        return UserActions.addUser.failed.action(e)
      })
      return Observable.fromPromise(p)
    }
  }

  updateUser(user: User) {
    let p = <Promise<any>>this.firebase.database.object(`${this._fbRoot}/users/${user.uid}`).set(user)
    p = p.then((reply) => {
      return UserActions.updateUser.fulfilled.action(user)
    }, (e) => {
      return UserActions.updateUser.failed.action(e)
    })
    return Observable.fromPromise(p)
  }

  removeUser(user: User) {
    console.log("UserEffects", "removeUser", user)
    let p = <Promise<any>>this.firebase.database.object(`${this._fbRoot}/users/${user.uid}`).remove()
    p = p.then((reply) => {
      return UserActions.removeUser.fulfilled.action(user)
    }, (e) => {
      return UserActions.removeUser.failed.action(e)
    })
    return Observable.fromPromise(p)
  }



  public ngOnDestroy(): void {
  }

}

