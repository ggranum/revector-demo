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
  Role,
  RolesHavePermissionGrantsRelation,
  Permission,
  PermissionGrant,
  RolePermission,
  PermissionActions
} from '../../'
import {
  AuthStoreState,
} from '../../interfaces'


// Our Components
import { RoleActions } from './role.actions'
import {
  ObjMap,
  expectMapToBeEmpty,
  expectMapToContainOnly
} from "@revector/shared";

let reducers = {
  auth: AuthReducers
}
let roleKey = "RoleFoo"
let permissionKey = "PermissionFoo"

let role:Role = {
  $key: roleKey,
  description: "Random test role",
  orderIndex: 1
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
let grantRole:RolesHavePermissionGrantsRelation = {}
grantRole[roleKey] = {}
grantRole[roleKey][permissionKey] = grant

let rolePerm:RolePermission = {
  role_key: roleKey,
  permission_key: permissionKey
}



describe('Auth-services.role.state', () => {
  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        StoreModule.provideStore(reducers),
      ],
    })
  })


  it('loads roles', async(inject([Store], (_store: Store<AuthStoreState>) => {
    let state: AuthStoreState = null

    let subscription = _store.select((s: AuthStoreState) => {
      state = s;
      return s.auth.roles
    }).subscribe((v:ObjMap<Role>) => {
      expectMapToBeEmpty(v)
    }, (e) => {
      fail(e)
    })
    _store.dispatch(RoleActions.getRoles.invoke.action())
  })))

  it('adds a role', async(inject([Store], (_store: Store<AuthStoreState>) => {
    let executionCount = 0
    let state: AuthStoreState = null

    let subscription = _store.select((s: AuthStoreState) => {
      state = s;
      return s.auth.roles
    }).subscribe((v:ObjMap<Role>) => {
      if (executionCount++ > 0) {
        expectMapToContainOnly(v, roleKey)
      }
    }, (e) => {
      fail(e)
    })

    _store.dispatch(RoleActions.addRole.invoke.action(role))
    expect(executionCount).toEqual(2, "Actions are synchronous")
    subscription.unsubscribe()

  })))

  it('removes a role', async(inject([Store], (_store: Store<AuthStoreState>) => {
    let executionCount = 0
    let state: AuthStoreState = null

    let subscription = _store.select((s: AuthStoreState) => {
      state = s;
      return s.auth.roles
    }).subscribe((v:ObjMap<Role>) => {
      if (executionCount === 1) {
        expectMapToContainOnly(v, roleKey)
      } else if(executionCount > 1){
        expectMapToBeEmpty(v)
      }
      executionCount++
    }, (e) => {
      fail(e)
    })

    _store.dispatch(RoleActions.addRole.invoke.action(role))
    _store.dispatch(RoleActions.removeRole.invoke.action({
      $key: roleKey,
      description: "Random test role"
    }))
    expect(executionCount).toEqual(2, "Actions are synchronous")
    subscription.unsubscribe()

  })))


  it('grants permissions', async(inject([Store], (_store: Store<AuthStoreState>) => {
    let executionCount = 0
    let state: AuthStoreState = null

    let subscription = _store.select((s: AuthStoreState) => {
      state = s;
      return s.auth.role_permissions
    }).subscribe((map:ObjMap<RolesHavePermissionGrantsRelation>) => {
      if (executionCount === 1) {
        expectMapToContainOnly(map, roleKey)
        expect(map[roleKey][permissionKey])
          .toBeDefined("Relationship join structure should contain permission for role.")
      } else if(executionCount > 1){
        fail("Should only intercept two events.")
      }
      executionCount++
    }, (e) => {
      fail(e)
    })

    _store.dispatch(RoleActions.addRole.invoke.action(role))
    _store.dispatch(PermissionActions.addPermission.invoke.action(permission))
    _store.dispatch(RoleActions.grantPermissionToRole.invoke.action(rolePerm))

    expect(executionCount).toEqual(2, "Actions are synchronous/Should have triggered two events.")
    subscription.unsubscribe()

  })))


  it('revokes permissions', async(inject([Store], (_store: Store<AuthStoreState>) => {
    let executionCount = 0
    let state: AuthStoreState = null
    let wasGranted = false

    let subscription = _store.select((s: AuthStoreState) => {
      state = s;
      return s.auth.role_permissions
    }).subscribe((map:ObjMap<RolesHavePermissionGrantsRelation>) => {
      if (executionCount === 0) {
        expectMapToContainOnly(map, roleKey)
        expect(map[roleKey][permissionKey]).toBeDefined("Relationship join structure should contain permission for role.")
        wasGranted = true
      } else if(executionCount == 1){
        expect(wasGranted).toBe(true, "Permission should have been granted previously")
        expect(map[roleKey][permissionKey]).toBeUndefined("Permission should have been revoked.")
      } else if(executionCount > 1){
        fail("Should only intercept three events.")
      }
      executionCount++
    }, (e) => {
      fail(e)
    })

    _store.dispatch(RoleActions.addRole.invoke.action(role))
    _store.dispatch(PermissionActions.addPermission.invoke.action(permission))
    _store.dispatch(RoleActions.grantPermissionToRole.invoke.action(rolePerm))
    _store.dispatch(RoleActions.revokePermissionFromRole.invoke.action(rolePerm))

    expect(executionCount).toEqual(2, "Actions are synchronous/Should have triggered two events.")
    subscription.unsubscribe()

  })))

});
