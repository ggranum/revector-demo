import {Permission, PermissionState} from '../../interfaces'
import {
  ActionDefinition, InvokableActionSet, actionDefinition,
  invokableActionSet
} from '../../../../shared'

const PERMISSION_PREFIX = '[Auth.permission] '

export interface PermissionActionsIF {
  initialize: ActionDefinition<PermissionState>
  getPermissions: InvokableActionSet<PermissionState, void, PermissionState>
  addPermission: InvokableActionSet<PermissionState, Permission, Permission>
  updatePermission: InvokableActionSet<PermissionState, Permission, Permission>
  removePermission: InvokableActionSet<PermissionState, Permission, Permission>
}

export let PermissionActions: PermissionActionsIF = {
  initialize: actionDefinition(PERMISSION_PREFIX + 'Initialize'),
  getPermissions: invokableActionSet<PermissionState, void, PermissionState>(PERMISSION_PREFIX + 'Get Permissions'),
  addPermission: invokableActionSet<PermissionState, Permission, Permission>(PERMISSION_PREFIX + 'Add Permission'),
  updatePermission: invokableActionSet<PermissionState, Permission, Permission>(PERMISSION_PREFIX + 'Update Permission'),
  removePermission: invokableActionSet<PermissionState, Permission, Permission>(PERMISSION_PREFIX + 'Remove Permission')
}
