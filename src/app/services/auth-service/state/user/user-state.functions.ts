import {
  User,
  PermissionGrant,
  UserPermission,
  UsersHavePermissionGrantsRelation,
  AuthServiceState,
  UserRole,
  UsersHaveRolesRelation
} from "@revector/auth-service";
import {
  TypedAction,
  ObjMap,
  generatePushID,
  ensureExists,
  removeIfExists,
  pathExists
} from "@revector/shared";
/**
 * Functions for handling User State actions. These methods could be static, but leaving them as instance methods for
 * the time being as it's more flexible if we want to refactor later.
 *
 * All methods must be pure - that is, side effect free.
 */
export class UserStateFunctions {


  getUsersFulfilled(state: ObjMap<User>, action: TypedAction<ObjMap<User>>): ObjMap<User> {
    state = Object.assign({}, action.payload)
    return state
  }

  addUser(state: ObjMap<User>, action: TypedAction<User>): ObjMap<User> {
    let newState: ObjMap<User> = Object.assign({}, state)
    let user = action.payload
    if (!user.uid) {
      user.uid = generatePushID()
    }
    newState[user.uid] = user
    return newState
  }

  /**
   * Handles a response from an asyncronous 'add' (e.g. an http reqeust) server after a user is added.
   * @param state
   * @param action
   * @returns {ObjMap<User>}
   */
  addUserFulfilled(state: ObjMap<User>, action: TypedAction<User>): ObjMap<User> {
    return state
  }

  updateUserFulfilled(state: ObjMap<User>, action: TypedAction<User>): ObjMap<User> {
    return Object.assign({}, state, {[action.payload.uid]: action.payload})
  }

  removeUserFulfilled(state: ObjMap<User>, action: TypedAction<User>): ObjMap<User> {
    let newState = Object.assign({}, state)
    delete newState[action.payload.uid]
    return newState
  }

  getUserPermissions(state: UsersHavePermissionGrantsRelation,
                     action: TypedAction<UsersHavePermissionGrantsRelation>): UsersHavePermissionGrantsRelation {
    return action.payload
  }

  grantPermissionToUser(state: UsersHavePermissionGrantsRelation,
                        action: TypedAction<UserPermission>): UsersHavePermissionGrantsRelation {
    let newState = state
    let userId = action.payload.user_uid
    let permissionId = action.payload.permission_key
    let userPermissions = newState[userId]
    if (!userPermissions) {
      newState = Object.assign({}, state)
      userPermissions = {}
    }
    let permission: PermissionGrant = userPermissions[permissionId] || {}

    permission = Object.assign({}, permission, {
      explicitlyGranted: true
    })
    delete permission.explicitlyRevoked
    userPermissions[permissionId] = permission
    newState[userId] = userPermissions
    return newState
  }

  revokePermissionFromUser(state: UsersHavePermissionGrantsRelation,
                           action: TypedAction<UserPermission>): UsersHavePermissionGrantsRelation {
    let newState = Object.assign({}, state)
    let userId = action.payload.user_uid
    let permissionId = action.payload.permission_key
    let userPermissions = newState[userId]
    if (!userPermissions) {
      userPermissions = {}
    }
    let permission: PermissionGrant = userPermissions[permissionId] || {}

    if (permission.explicitlyGranted === true) {
      delete permission.explicitlyGranted
    } else if (permission.roles != null) {
      permission = Object.assign({}, permission, {
        explicitlyRevoked: true
      })
    }

    if (!permission.roles && !permission.explicitlyGranted && !permission.explicitlyRevoked) {
      delete userPermissions[permissionId]
    } else {
      userPermissions[permissionId] = permission
    }
    newState[userId] = userPermissions
    return newState
  }

  getUserRoles(state: UsersHaveRolesRelation, action: TypedAction<UsersHaveRolesRelation>): UsersHaveRolesRelation {
    return action.payload
  }

  addUserToRole(state: AuthServiceState, action: TypedAction<UserRole>): AuthServiceState {
    let userId = action.payload.user_uid
    let roleName = action.payload.role_key
    let path = `user_roles.${userId}.${roleName}`
    if (!pathExists(state, path)) {
      ensureExists(state, path, true)
    }
    // now update the user's permissions.
    let permissions: ObjMap<boolean> = ensureExists(state, `role_permissions.${roleName}`, {})
    let userPermissions: ObjMap<PermissionGrant> = ensureExists(state, `user_permissions.${userId}`, {})
    Object.keys(permissions).forEach((permissionName: string) => {
      let userPermission: PermissionGrant = userPermissions[permissionName] || {}
      userPermission.roles = Object.assign({}, userPermission.roles)
      userPermission.roles[roleName] = true
      userPermissions[permissionName] = userPermission
    })
    state.user_permissions[userId] = userPermissions
    return state
  }


  /**
   * Changes required to fulfill action:
   *    auth.user_roles[user.uid]
   *    auth.user_permissions[user.uid]
   *
   * @todo ggranum: This method modifies the incoming state object.
   * It's a substantial refactor to fix that though, as it requires modification to haw the in the Mapping functions
   * operate.
   */
  removeUserFromRole(state: AuthServiceState, action: TypedAction<UserRole>): AuthServiceState {
    let userId = action.payload.user_uid
    let roleKey = action.payload.role_key
    let user_roles = Object.assign({}, state.user_roles)
    let user_permissions = Object.assign({}, state.user_permissions)
    let path = `user_roles.${userId}.${roleKey}`
    let existed = removeIfExists(state, path)
    if (existed) {
      state.user_roles[userId] = Object.assign({}, state.user_roles[userId])
      let permissions: ObjMap<boolean> = ensureExists(state, `role_permissions.${roleKey}`, {})
      let userPermissions: ObjMap<PermissionGrant> = ensureExists(state, `user_permissions.${userId}`, {})
      Object.keys(permissions).forEach((permissionName: string) => {
        let userPermission: PermissionGrant = userPermissions[permissionName] || {}
        userPermission.roles = Object.assign({}, userPermission.roles)
        delete userPermission.roles[roleKey]
        if (Object.keys(userPermission.roles).length === 0) {
          delete userPermission.roles
        }
        if (userPermission.explicitlyGranted === false) {
          delete userPermission.explicitlyGranted
        }
        if (userPermission.explicitlyRevoked === false) {
          delete userPermission.explicitlyRevoked
        }
        if (Object.keys(userPermission).length === 0) {
          delete userPermissions[permissionName]
        } else {
          userPermissions[permissionName] = userPermission
        }
      })
      state.user_permissions[userId] = Object.assign({}, userPermissions)
    }
    return state
  }
}
