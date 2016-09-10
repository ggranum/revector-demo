import {Permission} from '../../interfaces'
import {
  ObjMap,
  ActionDefinition, InvokableActionSet, actionDefinition,
  invokableActionSet
} from '../../../../shared'


export interface PermissionActionsIF {
  initialize: ActionDefinition<ObjMap<Permission>>
  getPermissions: InvokableActionSet<ObjMap<Permission>, void, ObjMap<Permission>>
  addPermission: InvokableActionSet<ObjMap<Permission>, Permission, Permission>
  updatePermission: InvokableActionSet<ObjMap<Permission>, Permission, Permission>
  removePermission: InvokableActionSet<ObjMap<Permission>, Permission, Permission>
}

export let PermissionActions: PermissionActionsIF = {
  initialize: actionDefinition('[Auth.permission] Initialize'),
  getPermissions: invokableActionSet<ObjMap<Permission>, void, ObjMap<Permission>>('[Auth.permission] Get Permissions'),
  addPermission: invokableActionSet<ObjMap<Permission>, Permission, Permission>('[Auth.permission] Add Permission'),
  updatePermission: invokableActionSet<ObjMap<Permission>, Permission, Permission>('[Auth.permission] Update Permission'),
  removePermission: invokableActionSet<ObjMap<Permission>, Permission, Permission>('[Auth.permission] Remove Permission')
}
