import {
  User,

  UserRole,
  UsersHaveRolesRelation,
  AuthServiceState,
  UsersHavePermissionGrantsRelation,
  UserPermission,
  PermissionGrant
} from '../../interfaces'
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
import { UserStateFunctions } from "./user-state.functions";


const stateFunctions = new UserStateFunctions()
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

const USER_ROLE_MAPPING = {
  toMapped: (state: AuthServiceState): UsersHaveRolesRelation => {
    return state.user_roles
  },
  fromMapped: (state: AuthServiceState, mapped: UsersHaveRolesRelation): AuthServiceState => {
    state.user_roles = mapped
    return state
  },
}

const USER_PERMISSION_MAPPING = {
  toMapped: (state: AuthServiceState): UsersHavePermissionGrantsRelation => {
    return state.user_permissions
  },
  fromMapped: (state: AuthServiceState, mapped: UsersHavePermissionGrantsRelation): AuthServiceState => {
    state.user_permissions = mapped
    return state
  },
}

userReducers.registerMapped(UserActions.addUser.invoke, USER_MAPPING, stateFunctions.addUser)
userReducers.registerMapped(UserActions.addUser.fulfilled, USER_MAPPING, stateFunctions.addUserFulfilled)
userReducers.register(UserActions.addUser.failed)


userReducers.register(UserActions.getUsers.invoke)
userReducers.registerMapped(UserActions.getUsers.fulfilled, USER_MAPPING, stateFunctions.getUsersFulfilled)
userReducers.registerError(UserActions.getUsers.failed)


userReducers.register(UserActions.updateUser.invoke)
userReducers.registerMapped(UserActions.updateUser.fulfilled, USER_MAPPING, stateFunctions.updateUserFulfilled)

userReducers.registerError(UserActions.updateUser.failed)


userReducers.register(UserActions.removeUser.invoke)
userReducers.registerMapped(UserActions.removeUser.fulfilled, USER_MAPPING, stateFunctions.removeUserFulfilled)
userReducers.registerError(UserActions.removeUser.failed)


userReducers.register(UserActions.getUserRoles.invoke)
userReducers.registerMapped(UserActions.getUserRoles.fulfilled, USER_ROLE_MAPPING, stateFunctions.getUserRoles)
userReducers.registerError(UserActions.getUserRoles.failed)

userReducers.register(UserActions.addUserToRole.invoke, stateFunctions.addUserToRole)
userReducers.register(UserActions.addUserToRole.fulfilled)
userReducers.registerError(UserActions.addUserToRole.failed)

userReducers.register(UserActions.removeUserFromRole.invoke, stateFunctions.removeUserFromRole)
userReducers.register(UserActions.removeUserFromRole.fulfilled)
userReducers.registerError(UserActions.removeUserFromRole.failed)


userReducers.register(UserActions.getUserPermissions.invoke)
userReducers.registerMapped(UserActions.getUserPermissions.fulfilled, USER_PERMISSION_MAPPING, stateFunctions.getUserPermissions)
userReducers.registerError(UserActions.getUserPermissions.failed)

userReducers.registerMapped(UserActions.grantPermissionToUser.invoke, USER_PERMISSION_MAPPING, stateFunctions.grantPermissionToUser)
userReducers.register(UserActions.grantPermissionToUser.fulfilled)
userReducers.registerError(UserActions.grantPermissionToUser.failed)


/**
 *
 */
userReducers.registerMapped(UserActions.revokePermissionFromUser.invoke, USER_PERMISSION_MAPPING, stateFunctions.revokePermissionFromUser)
userReducers.register(UserActions.revokePermissionFromUser.fulfilled)
userReducers.registerError(UserActions.revokePermissionFromUser.failed)



