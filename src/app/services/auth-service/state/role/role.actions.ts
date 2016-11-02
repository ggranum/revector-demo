import {Role, RolePermission, RoleHasPermissionGrantsRelation} from '../../models'
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
  getRolePermissions: InvokableActionSet<RoleHasPermissionGrantsRelation, void, RoleHasPermissionGrantsRelation>
  grantPermissionToRole: InvokableActionSet<RoleHasPermissionGrantsRelation, RolePermission, RolePermission>
  revokePermissionFromRole: InvokableActionSet<RoleHasPermissionGrantsRelation, RolePermission, RolePermission>
}

export let RoleActions: RoleActionsIF = {
  initialize: actionDefinition(ROLE_PREFIX + 'Initialize'),
  getRoles: invokableActionSet<ObjMap<Role>, void, ObjMap<Role>>(ROLE_PREFIX + 'Get Roles'),
  addRole: invokableActionSet<ObjMap<Role>, Role, Role>(ROLE_PREFIX + 'Add Role'),
  updateRole: invokableActionSet<ObjMap<Role>, Update<Role>, Update<Role>>(ROLE_PREFIX + 'Update Role'),
  removeRole: invokableActionSet<ObjMap<Role>, Role, Role>(ROLE_PREFIX + 'Remove Role'),
  getRolePermissions: invokableActionSet<RoleHasPermissionGrantsRelation, void, RoleHasPermissionGrantsRelation>(
    ROLE_PREFIX + 'Get role permissions'),
  grantPermissionToRole: invokableActionSet<RoleHasPermissionGrantsRelation, RolePermission, RolePermission>(
    ROLE_PREFIX + 'Grant permission to Role'),
  revokePermissionFromRole: invokableActionSet<RoleHasPermissionGrantsRelation, RolePermission, RolePermission>(
    ROLE_PREFIX + 'Revoke permission from Role'),
}
