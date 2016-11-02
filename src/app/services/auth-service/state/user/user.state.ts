import {
  User,

  UserRole,
  UsersHaveRolesRelation,
  AuthServiceState,
  UsersHavePermissionGrantsRelation,
  UserPermission,
  PermissionGrant
} from '../../models'
import {UserActions} from './user.actions'
import {
  generatePushID,
  TypedAction,
  ActionReducerSet,
  ensureExists,
  pathExists,
  ObjMap,
  removeIfExists
} from '@revector/shared'


export const userReducers = new ActionReducerSet<AuthServiceState>()

const USER_MAPPING = {
  toMapped: (state: AuthServiceState): ObjMap<User> => {
    return state.users
  },
  fromMapped: (state: AuthServiceState, mapped: ObjMap<User>): AuthServiceState => {
    state.users = mapped
    return state
  },
}


userReducers.registerMapped(UserActions.addUser.invoke,
  USER_MAPPING,
  (state: ObjMap<User>, action: TypedAction<User>) => {
    let newState: ObjMap<User> = Object.assign({}, state)
    let user = action.payload
    if (!user.uid) {
      user.uid = generatePushID()
      newState[user.uid] = user
    }
    return newState
  })

userReducers.registerMapped(UserActions.addUser.fulfilled,
  USER_MAPPING,
  (state: ObjMap<User>, action: TypedAction<User>) => {
    return state
  })
userReducers.register(UserActions.addUser.failed)


userReducers.register(UserActions.getUsers.invoke)
userReducers.registerMapped(UserActions.getUsers.fulfilled,
  USER_MAPPING,
  (state: ObjMap<User>, action: TypedAction<ObjMap<User>>) => {
    state = Object.assign({}, action.payload)
    return state
  })
userReducers.registerError(UserActions.getUsers.failed)


userReducers.register(UserActions.updateUser.invoke)
userReducers.registerMapped(UserActions.updateUser.fulfilled,
  USER_MAPPING,
  (state: ObjMap<User>, action: TypedAction<User>) => {
    return Object.assign({}, state, {[action.payload.uid]: action.payload})
  })
userReducers.registerError(UserActions.updateUser.failed)


userReducers.register(UserActions.removeUser.invoke)
userReducers.registerMapped(UserActions.removeUser.fulfilled,
  USER_MAPPING,
  (state: ObjMap<User>, action: TypedAction<User>) => {
    let newState = Object.assign({}, state)
    delete newState[action.payload.uid]
    return newState
  })
userReducers.registerError(UserActions.removeUser.failed)


const USER_ROLE_MAPPING = {
  toMapped: (state: AuthServiceState): UsersHaveRolesRelation => {
    return state.user_roles
  },
  fromMapped: (state: AuthServiceState, mapped: UsersHaveRolesRelation): AuthServiceState => {
    state.user_roles = mapped
    return state
  },
}
userReducers.register(UserActions.getUserRoles.invoke)
userReducers.registerMapped(UserActions.getUserRoles.fulfilled,
  USER_ROLE_MAPPING,
  (state: UsersHaveRolesRelation, action: TypedAction<UsersHaveRolesRelation>) => {
    return action.payload
  })
userReducers.registerError(UserActions.getUserRoles.failed)

userReducers.register(UserActions.addUserToRole.invoke,
  (state: AuthServiceState, action: TypedAction<UserRole>) => {
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
  })
userReducers.register(UserActions.addUserToRole.fulfilled)
userReducers.registerError(UserActions.addUserToRole.failed)

userReducers.register(UserActions.removeUserFromRole.invoke,
  (state: AuthServiceState, action: TypedAction<UserRole>) => {
    let userId = action.payload.user_uid
    let roleName = action.payload.role_key
    let path = `user_roles.${userId}.${roleName}`
    let existed = removeIfExists(state, path)
    if (existed) {
      state.user_roles[userId] = Object.assign({}, state.user_roles[userId])
      let permissions: ObjMap<boolean> = ensureExists(state, `role_permissions.${roleName}`, {})
      let userPermissions: ObjMap<PermissionGrant> = ensureExists(state, `user_permissions.${userId}`, {})
      Object.keys(permissions).forEach((permissionName: string) => {
        let userPermission: PermissionGrant = userPermissions[permissionName] || {}
        userPermission.roles = Object.assign({}, userPermission.roles)
        delete userPermission.roles[roleName]
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
  })
userReducers.register(UserActions.removeUserFromRole.fulfilled)
userReducers.registerError(UserActions.removeUserFromRole.failed)


const USER_PERMISSION_MAPPING = {
  toMapped: (state: AuthServiceState): UsersHavePermissionGrantsRelation => {
    return state.user_permissions
  },
  fromMapped: (state: AuthServiceState, mapped: UsersHavePermissionGrantsRelation): AuthServiceState => {
    state.user_permissions = mapped
    return state
  },
}

userReducers.register(UserActions.getUserPermissions.invoke)
userReducers.registerMapped(UserActions.getUserPermissions.fulfilled,
  USER_PERMISSION_MAPPING,
  (state: UsersHavePermissionGrantsRelation, action: TypedAction<UsersHavePermissionGrantsRelation>) => {
    return action.payload
  })
userReducers.registerError(UserActions.getUserPermissions.failed)

userReducers.registerMapped(UserActions.grantPermissionToUser.invoke,
  USER_PERMISSION_MAPPING,
  (state: UsersHavePermissionGrantsRelation, action: TypedAction<UserPermission>) => {
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
  })
userReducers.register(UserActions.grantPermissionToUser.fulfilled)
userReducers.registerError(UserActions.grantPermissionToUser.failed)

userReducers.registerMapped(UserActions.revokePermissionFromUser.invoke,
  USER_PERMISSION_MAPPING,
  (state: UsersHavePermissionGrantsRelation, action: TypedAction<UserPermission>) => {
    let newState = state
    let userId = action.payload.user_uid
    let permissionId = action.payload.permission_key
    let userPermissions = newState[userId]
    if (!userPermissions) {
      newState = Object.assign({}, state)
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

    userPermissions[permissionId] = permission
    newState[userId] = userPermissions
    return newState
  })
userReducers.register(UserActions.revokePermissionFromUser.fulfilled)
userReducers.registerError(UserActions.revokePermissionFromUser.failed)



