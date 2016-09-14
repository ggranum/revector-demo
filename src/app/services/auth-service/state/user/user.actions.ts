import {User, UserRole, UserState, UserRolesMappings, UserPermissionsMappings, UserPermission} from '../../interfaces'
import {
  ActionDefinition, InvokableActionSet, actionDefinition,
  invokableActionSet
} from '../../../../shared'

const USER_PREFIX = '[Auth.user] '


export interface UserActionsIF {
  initialize: ActionDefinition<UserState>
  getUsers: InvokableActionSet<UserState, void, UserState>
  addUser: InvokableActionSet<UserState, User, User>
  updateUser: InvokableActionSet<UserState, User, User>
  removeUser: InvokableActionSet<UserState, User, User>
  getUserRoles: InvokableActionSet<UserRolesMappings, void, UserRolesMappings>
  addUserToRole: InvokableActionSet<UserState, UserRole, UserRole>
  removeUserFromRole: InvokableActionSet<UserState, UserRole, UserRole>
  getUserPermissions: InvokableActionSet<UserPermissionsMappings, void, UserPermissionsMappings>
  grantPermissionToUser: InvokableActionSet<UserPermissionsMappings, UserPermission, UserPermission>
  revokePermissionFromUser: InvokableActionSet<UserPermissionsMappings, UserPermission, UserPermission>
}

export let UserActions: UserActionsIF = {
  initialize: actionDefinition(USER_PREFIX + 'Initialize'),
  getUsers: invokableActionSet<UserState, void, UserState>(USER_PREFIX + 'Get Users'),
  addUser: invokableActionSet<UserState, User, User>(USER_PREFIX + 'Add User'),
  updateUser: invokableActionSet<UserState, User, User>(USER_PREFIX + 'Update User'),
  removeUser: invokableActionSet<UserState, User, User>(USER_PREFIX + 'Remove User'),
  getUserRoles: invokableActionSet<UserRolesMappings, void, UserRolesMappings>(USER_PREFIX + 'Get user roles'),
  addUserToRole: invokableActionSet<UserState, UserRole, UserRole>(USER_PREFIX + 'Add user to role'),
  removeUserFromRole: invokableActionSet<UserState, UserRole, UserRole>(USER_PREFIX + 'Remove user from role'),
  getUserPermissions: invokableActionSet<UserPermissionsMappings, void, UserPermissionsMappings>(USER_PREFIX + 'Get user permissions'),
  grantPermissionToUser: invokableActionSet<UserPermissionsMappings, UserPermission, UserPermission>(USER_PREFIX + 'Grant permission to User'),
  revokePermissionFromUser: invokableActionSet<UserPermissionsMappings, UserPermission, UserPermission>(USER_PREFIX + 'Revoke permission from User'),}
