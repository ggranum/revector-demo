import { AuthorizationService } from "./authorization.service";
import {
  User,
  Permission,
  AuthServiceState
} from "@revector/auth-service";


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

let authState:AuthServiceState



describe('auth-service.permission-service', () => {
  beforeEach(() => {
    authState = {
      transient: {},
      permissions: {},
      user_permissions: {},
      users: {}
    }

    authState.users[user.uid] = user
    authState.permissions[permission.$key] = permission

    let userPerms = {}
    authState.user_permissions[user.uid] = userPerms
    userPerms[permission.$key] = {
      explicitlyGranted: true
    }


  })

  it("grants permission when user has permission explicitly granted", () => {
    let result = AuthorizationService._checkPermission(user, permission.$key, authState)
    expect(result.hasPermission).toBe(true)
  })

  it("grants permission when user has permission granted through a role", () => {
    let userPerms = {}
    let userPerm = {
      roles:{}
    }
    userPerms[permission.$key] = userPerm
    userPerm.roles["FakeRole"] = true
    authState.user_permissions[user.uid] = userPerms


    let result = AuthorizationService._checkPermission(user, permission.$key, authState)
    expect(result.hasPermission).toBe(true)
  })

  it("denies permission with appropriate message when user doesn't exist", () => {
    delete authState.users[user.uid]
    let result = AuthorizationService._checkPermission(user, permission.$key, authState)
    expect(result.hasPermission).toBe(false)
    expect(result.userDoesNotExist).toBeTruthy()
  })

  it("denies permission with appropriate message when permission doesn't exist", () => {
    delete authState.permissions[permission.$key]
    let result = AuthorizationService._checkPermission(user, permission.$key, authState)
    expect(result.hasPermission).toBe(false)
    expect(result.permissionDoesNotExist).toBeTruthy()
  })

  it("denies permission with appropriate message when permission explicitly revoked", () => {
    let userPerms = {}
    userPerms[permission.$key] = {
      explicitlyRevoked:true
    }
    authState.user_permissions[user.uid] = userPerms

    let result = AuthorizationService._checkPermission(user, permission.$key, authState)
    expect(result.hasPermission).toBe(false)
    expect(result.reason).toContain("explicitly revoked")
  })

})
