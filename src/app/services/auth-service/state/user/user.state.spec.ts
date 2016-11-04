/* tslint:disable:no-unused-variable */

import {
  inject,
  TestBed,
  async
} from '@angular/core/testing'
import { Store } from '@ngrx/store'

// NG RX
import { StoreModule } from '@ngrx/store'

// Dev modules
import {
  AuthReducers,
  User,
  UsersHavePermissionGrantsRelation,
  Permission,
  PermissionGrant,
  UserPermission,
  PermissionActions
} from '../../'
import {
  AuthStoreState,
} from '../../interfaces'


// Our Components
import { UserActions } from './user.actions'
import {
  ObjMap,
  expectMapToBeEmpty,
  expectMapToContainOnly
} from "@revector/shared";

let reducers = {
  auth: AuthReducers
}
let userKey = "UserFoo"
let permissionKey = "PermissionFoo"


let user:User = {
  uid: userKey,
  createdMils: Date.now(),
  email:"joe.user@example.com"
}
let permission:Permission = {
  $key: permissionKey,
  description: "Random test permission",
  orderIndex: 1
}
let grant:PermissionGrant = {
  $key: permissionKey,
  explicitlyGranted: true
}
let grantUser:UsersHavePermissionGrantsRelation = {}
grantUser[userKey] = {}
grantUser[userKey][permissionKey] = grant

let userPerm:UserPermission = {
  user_uid: userKey,
  permission_key: permissionKey
}



describe('Auth-services.user.state', () => {
  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        StoreModule.provideStore(reducers),
      ],
    })
  })


  it('loads users', async(inject([Store], (_store: Store<AuthStoreState>) => {
    let executionCount = 0
    let state: AuthStoreState = null

    let subscription = _store.select((s: AuthStoreState) => {
      state = s;
      return s.auth.users
    }).subscribe((v:ObjMap<User>) => {
      expectMapToBeEmpty(v)
      executionCount++
    }, (e) => {
      fail(e)
    })
    _store.dispatch(UserActions.getUsers.invoke.action())
    expect(executionCount).toEqual(1, "Actions are synchronous/Should have triggered one event.")
    subscription.unsubscribe()

  })))

  it('adds a user', async(inject([Store], (_store: Store<AuthStoreState>) => {
    let executionCount = 0
    let state: AuthStoreState = null

    let subscription = _store.select((s: AuthStoreState) => {
      state = s;
      return s.auth.users
    }).subscribe((v:ObjMap<User>) => {
      if (executionCount++ > 0) {
        expectMapToContainOnly(v, userKey)
      }
    }, (e) => {
      fail(e)
    })

    _store.dispatch(UserActions.addUser.invoke.action(user))
    expect(executionCount).toEqual(2, "Actions are synchronous/Should have triggered two events.")
    subscription.unsubscribe()

  })))

  it('removes a user', async(inject([Store], (_store: Store<AuthStoreState>) => {
    let executionCount = 0
    let state: AuthStoreState = null

    let subscription = _store.select((s: AuthStoreState) => {
      state = s;
      return s.auth.users
    }).subscribe((v:ObjMap<User>) => {
      if (executionCount === 1) {
        expectMapToContainOnly(v, userKey)
      } else if(executionCount > 1){
        expectMapToBeEmpty(v)
      }
      executionCount++
    }, (e) => {
      fail(e)
    })

    _store.dispatch(UserActions.addUser.invoke.action(user))
    _store.dispatch(UserActions.removeUser.invoke.action(Object.assign({}, user)))
    expect(executionCount).toEqual(2, "Actions are synchronous")
    subscription.unsubscribe()

  })))


  it('grants permissions', async(inject([Store], (_store: Store<AuthStoreState>) => {
    let executionCount = 0
    let state: AuthStoreState = null

    let subscription = _store.select((s: AuthStoreState) => {
      state = s;
      return s.auth.user_permissions
    }).subscribe((map:ObjMap<UsersHavePermissionGrantsRelation>) => {
      if (executionCount === 1) {
        expectMapToContainOnly(map, userKey)
        expect(map[userKey][permissionKey])
          .toBeDefined("Relationship join structure should contain permission for user.")
      }
      executionCount++
    }, (e) => {
      fail(e)
    })

    _store.dispatch(UserActions.addUser.invoke.action(user))
    _store.dispatch(PermissionActions.addPermission.invoke.action(permission))
    _store.dispatch(UserActions.grantPermissionToUser.invoke.action(userPerm))

    expect(executionCount).toEqual(2, "Actions are synchronous/Should have triggered two events.")
    subscription.unsubscribe()

  })))


  it('revokes permissions', async(inject([Store], (_store: Store<AuthStoreState>) => {
    let executionCount = 0
    let state: AuthStoreState = null
    let wasGranted = false

    let subscription = _store.select((s: AuthStoreState) => {
      state = s;
      return s.auth.user_permissions
    }).subscribe((map:ObjMap<UsersHavePermissionGrantsRelation>) => {
      if (executionCount === 0) {
        expectMapToContainOnly(map, userKey)
        expect(map[userKey][permissionKey]).toBeDefined("Relationship join structure should contain permission for user.")
        wasGranted = true
      } else if(executionCount == 1){
        expect(wasGranted).toBe(true, "Permission should have been granted previously")
        expect(map[userKey][permissionKey]).toBeUndefined("Permission should have been revoked.")
      }
      executionCount++
    }, (e) => {
      fail(e)
    })

    _store.dispatch(UserActions.addUser.invoke.action(user))
    _store.dispatch(PermissionActions.addPermission.invoke.action(permission))
    _store.dispatch(UserActions.grantPermissionToUser.invoke.action(userPerm))
    _store.dispatch(UserActions.revokePermissionFromUser.invoke.action(userPerm))

    expect(executionCount).toEqual(2, "Actions are synchronous/Should have triggered two events.")
    subscription.unsubscribe()

  })))

});
