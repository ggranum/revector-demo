import {Role, RolePermission, RolesHavePermissionGrantsRelation} from '../../interfaces'
import {
  ActionDefinition,
  InvokableActionSet,
  actionDefinition,
  invokableActionSet,
  Update,
  ObjMap
} from '@revector/shared'

const ROLE_PREFIX = '[Auth.role] '
export interface RoleActionsIF {
  initialize: ActionDefinition<ObjMap<Role>>
  getRoles: InvokableActionSet<ObjMap<Role>, void, ObjMap<Role>>
  addRole: InvokableActionSet<ObjMap<Role>, Role, Role>
  updateRole: InvokableActionSet<ObjMap<Role>, Update<Role>, Update<Role>>
  removeRole: InvokableActionSet<ObjMap<Role>, Role, Role>
  getRolePermissions: InvokableActionSet<RolesHavePermissionGrantsRelation, void, RolesHavePermissionGrantsRelation>
  grantPermissionToRole: InvokableActionSet<RolesHavePermissionGrantsRelation, RolePermission, RolePermission>
  revokePermissionFromRole: InvokableActionSet<RolesHavePermissionGrantsRelation, RolePermission, RolePermission>
}

export let RoleActions: RoleActionsIF = {
  initialize: actionDefinition(ROLE_PREFIX + 'Initialize'),
  getRoles: invokableActionSet<ObjMap<Role>, void, ObjMap<Role>>(ROLE_PREFIX + 'Get Roles'),
  addRole: invokableActionSet<ObjMap<Role>, Role, Role>(ROLE_PREFIX + 'Add Role'),
  updateRole: invokableActionSet<ObjMap<Role>, Update<Role>, Update<Role>>(ROLE_PREFIX + 'Update Role'),
  removeRole: invokableActionSet<ObjMap<Role>, Role, Role>(ROLE_PREFIX + 'Remove Role'),
  getRolePermissions: invokableActionSet<RolesHavePermissionGrantsRelation, void, RolesHavePermissionGrantsRelation>(
    ROLE_PREFIX + 'Get role permissions'),
  grantPermissionToRole: invokableActionSet<RolesHavePermissionGrantsRelation, RolePermission, RolePermission>(
    ROLE_PREFIX + 'Grant permission to Role'),
  revokePermissionFromRole: invokableActionSet<RolesHavePermissionGrantsRelation, RolePermission, RolePermission>(
    ROLE_PREFIX + 'Revoke permission from Role'),
}
