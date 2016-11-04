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
  Permission
} from '../../'
import {
  AuthStoreState,
} from '../../interfaces'


// Our Components
import { PermissionActions } from './permission.actions'
import {
  ObjMap,
  expectMapToBeEmpty,
  expectMapToContainOnly
} from "@revector/shared";

let reducers = {
  auth: AuthReducers
}


describe('Auth-services.permission.state', () => {
  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        StoreModule.provideStore(reducers),
      ],
    })
  })


  it('loads permissions', async(inject([Store], (_store: Store<AuthStoreState>) => {
    let state: AuthStoreState = null
    let count = 0

    let subscription = _store.select((s: AuthStoreState) => {
      state = s;
      return s.auth.permissions
    }).subscribe((v:ObjMap<Permission>) => {
      expectMapToBeEmpty(v)
    }, (e) => {
      fail(e)
    })
    _store.dispatch(PermissionActions.getPermissions.invoke.action())
  })))

  it('adds a permission', async(inject([Store], (_store: Store<AuthStoreState>) => {
    let executionCount = 0
    let permissionKey = "PermissionToFly"
    let state: AuthStoreState = null

    let subscription = _store.select((s: AuthStoreState) => {
      state = s;
      return s.auth.permissions
    }).subscribe((v:ObjMap<Permission>) => {
      if (executionCount++ > 0) {
        expectMapToContainOnly(v, permissionKey)
      }
    }, (e) => {
      fail(e)
    })

    _store.dispatch(PermissionActions.addPermission.invoke.action({
      $key: permissionKey,
      description: "Random test permission",
      orderIndex: 1
    }))
    expect(executionCount).toEqual(2, "Actions are synchronous")
    subscription.unsubscribe()

  })))

  it('removes a permission', async(inject([Store], (_store: Store<AuthStoreState>) => {
    let executionCount = 0
    let permissionKey = "PermissionToFly"
    let state: AuthStoreState = null

    let subscription = _store.select((s: AuthStoreState) => {
      state = s;
      return s.auth.permissions
    }).subscribe((v:ObjMap<Permission>) => {
      if (executionCount === 1) {
        expectMapToContainOnly(v, permissionKey)
      } else if(executionCount > 1){
        expectMapToBeEmpty(v)
      }
      executionCount++
    }, (e) => {
      fail(e)
    })

    _store.dispatch(PermissionActions.addPermission.invoke.action({
      $key: permissionKey,
      description: "Random test permission",
      orderIndex: 1
    }))
    _store.dispatch(PermissionActions.removePermission.invoke.action({
      $key: permissionKey,
    }))
    expect(executionCount).toEqual(2, "Actions are synchronous")
    subscription.unsubscribe()

  })))

});
