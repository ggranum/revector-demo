import {Role} from '../../interfaces'
import {
  ObjMap,
  ActionDefinition, InvokableActionSet, actionDefinition,
  invokableActionSet
} from '../../../../shared'


export interface RoleActionsIF {
  initialize: ActionDefinition<ObjMap<Role>>
  getRoles: InvokableActionSet<ObjMap<Role>, void, ObjMap<Role>>
  addRole: InvokableActionSet<ObjMap<Role>, Role, Role>
  updateRole: InvokableActionSet<ObjMap<Role>, Role, Role>
  removeRole: InvokableActionSet<ObjMap<Role>, Role, Role>
}

export let RoleActions: RoleActionsIF = {
  initialize: actionDefinition('[Auth.role] Initialize'),
  getRoles: invokableActionSet<ObjMap<Role>, void, ObjMap<Role>>('[Auth.role] Get Roles'),
  addRole: invokableActionSet<ObjMap<Role>, Role, Role>('[Auth.role] Add Role'),
  updateRole: invokableActionSet<ObjMap<Role>, Role, Role>('[Auth.role] Update Role'),
  removeRole: invokableActionSet<ObjMap<Role>, Role, Role>('[Auth.role] Remove Role')
}
