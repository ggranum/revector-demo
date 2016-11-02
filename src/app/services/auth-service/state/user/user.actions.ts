import {User, UserRole, UsersHaveRolesRelation, UsersHavePermissionGrantsRelation, UserPermission} from '../../models'
import {
  ActionDefinition,
  InvokableActionSet,
  actionDefinition,
  invokableActionSet,
  ObjMap
} from '@revector/shared'

const USER_PREFIX = '[Auth.user] '


export interface UserActionsIF {
  initialize: ActionDefinition<ObjMap<User>>
  getUsers: InvokableActionSet<ObjMap<User>, void, ObjMap<User>>
  addUser: InvokableActionSet<ObjMap<User>, User, User>
  updateUser: InvokableActionSet<ObjMap<User>, User, User>
  removeUser: InvokableActionSet<ObjMap<User>, User, User>
  getUserRoles: InvokableActionSet<UsersHaveRolesRelation, void, UsersHaveRolesRelation>
  addUserToRole: InvokableActionSet<ObjMap<User>, UserRole, UserRole>
  removeUserFromRole: InvokableActionSet<ObjMap<User>, UserRole, UserRole>
  getUserPermissions: InvokableActionSet<UsersHavePermissionGrantsRelation, void, UsersHavePermissionGrantsRelation>
  grantPermissionToUser: InvokableActionSet<UsersHavePermissionGrantsRelation, UserPermission, UserPermission>
  revokePermissionFromUser: InvokableActionSet<UsersHavePermissionGrantsRelation, UserPermission, UserPermission>
}

export let UserActions: UserActionsIF = {
  initialize: actionDefinition(USER_PREFIX + 'Initialize'),
  getUsers: invokableActionSet<ObjMap<User>, void, ObjMap<User>>(USER_PREFIX + 'Get Users'),
  addUser: invokableActionSet<ObjMap<User>, User, User>(USER_PREFIX + 'Add User'),
  updateUser: invokableActionSet<ObjMap<User>, User, User>(USER_PREFIX + 'Update User'),
  removeUser: invokableActionSet<ObjMap<User>, User, User>(USER_PREFIX + 'Remove User'),
  getUserRoles: invokableActionSet<UsersHaveRolesRelation, void, UsersHaveRolesRelation>(USER_PREFIX + 'Get user roles'),
  addUserToRole: invokableActionSet<ObjMap<User>, UserRole, UserRole>(USER_PREFIX + 'Add user to role'),
  removeUserFromRole: invokableActionSet<ObjMap<User>, UserRole, UserRole>(USER_PREFIX + 'Remove user from role'),
  getUserPermissions: invokableActionSet<UsersHavePermissionGrantsRelation, void, UsersHavePermissionGrantsRelation>(
    USER_PREFIX + 'Get user permissions'),
  grantPermissionToUser: invokableActionSet<UsersHavePermissionGrantsRelation, UserPermission, UserPermission>(
    USER_PREFIX + 'Grant permission to User'),
  revokePermissionFromUser: invokableActionSet<UsersHavePermissionGrantsRelation, UserPermission, UserPermission>(
    USER_PREFIX + 'Revoke permission from User'),
}
