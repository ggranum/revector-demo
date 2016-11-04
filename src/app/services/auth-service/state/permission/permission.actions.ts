import {Permission} from '../../interfaces'
import {
  ActionDefinition,
  InvokableActionSet,
  actionDefinition,
  invokableActionSet,
  Update,
  ObjMap
} from '@revector/shared'

const PERMISSION_PREFIX = '[Auth.permission] '

export interface PermissionActionsIF {
  initialize: ActionDefinition<ObjMap<Permission>>
  getPermissions: InvokableActionSet<ObjMap<Permission>, void, ObjMap<Permission>>
  addPermission: InvokableActionSet<ObjMap<Permission>, Permission, Permission>
  updatePermission: InvokableActionSet<ObjMap<Permission>, Update<Permission>, Update<Permission>>
  removePermission: InvokableActionSet<ObjMap<Permission>, Permission, Permission>
}

export let PermissionActions: PermissionActionsIF = {
  initialize: actionDefinition(PERMISSION_PREFIX + 'Initialize'),
  getPermissions: invokableActionSet<ObjMap<Permission>, void, ObjMap<Permission>>(PERMISSION_PREFIX + 'Get Permissions'),
  addPermission: invokableActionSet<ObjMap<Permission>, Permission, Permission>(PERMISSION_PREFIX + 'Add Permission'),
  updatePermission: invokableActionSet<ObjMap<Permission>, Update<Permission>, Update<Permission>>(PERMISSION_PREFIX + 'Update Permission'),
  removePermission: invokableActionSet<ObjMap<Permission>, Permission, Permission>(PERMISSION_PREFIX + 'Remove Permission')
}
