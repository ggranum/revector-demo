import {Role, RoleState, RolePermission, RolePermissionsMappings} from '../../interfaces'
import {
  ActionDefinition,
  InvokableActionSet,
  actionDefinition,
  invokableActionSet,
  Update
} from '../../../../shared'
import {} from '../../../../shared/rv-ngrx-util'

const ROLE_PREFIX = '[Auth.role] '
export interface RoleActionsIF {
  initialize: ActionDefinition<RoleState>
  getRoles: InvokableActionSet<RoleState, void, RoleState>
  addRole: InvokableActionSet<RoleState, Role, Role>
  updateRole: InvokableActionSet<RoleState, Update<Role>, Update<Role>>
  removeRole: InvokableActionSet<RoleState, Role, Role>
  getRolePermissions: InvokableActionSet<RolePermissionsMappings, void, RolePermissionsMappings>
  grantPermissionToRole: InvokableActionSet<RolePermissionsMappings, RolePermission, RolePermission>
  revokePermissionFromRole: InvokableActionSet<RolePermissionsMappings, RolePermission, RolePermission>
}

export let RoleActions: RoleActionsIF = {
  initialize: actionDefinition(ROLE_PREFIX + 'Initialize'),
  getRoles: invokableActionSet<RoleState, void, RoleState>(ROLE_PREFIX + 'Get Roles'),
  addRole: invokableActionSet<RoleState, Role, Role>(ROLE_PREFIX + 'Add Role'),
  updateRole: invokableActionSet<RoleState, Update<Role>, Update<Role>>(ROLE_PREFIX + 'Update Role'),
  removeRole: invokableActionSet<RoleState, Role, Role>(ROLE_PREFIX + 'Remove Role'),
  getRolePermissions: invokableActionSet<RolePermissionsMappings, void, RolePermissionsMappings>(
    ROLE_PREFIX + 'Get role permissions'),
  grantPermissionToRole: invokableActionSet<RolePermissionsMappings, RolePermission, RolePermission>(
    ROLE_PREFIX + 'Grant permission to Role'),
  revokePermissionFromRole: invokableActionSet<RolePermissionsMappings, RolePermission, RolePermission>(
    ROLE_PREFIX + 'Revoke permission from Role'),
}
