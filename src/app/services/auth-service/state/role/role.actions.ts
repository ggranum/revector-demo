import {Role, RoleState} from '../../interfaces'
import {
  ActionDefinition, InvokableActionSet, actionDefinition,
  invokableActionSet
} from '../../../../shared'

const ROLE_PREFIX = '[Auth.role] '
export interface RoleActionsIF {
  initialize: ActionDefinition<RoleState>
  getRoles: InvokableActionSet<RoleState, void, RoleState>
  addRole: InvokableActionSet<RoleState, Role, Role>
  updateRole: InvokableActionSet<RoleState, Role, Role>
  removeRole: InvokableActionSet<RoleState, Role, Role>
}

export let RoleActions: RoleActionsIF = {
  initialize: actionDefinition(ROLE_PREFIX + 'Initialize'),
  getRoles: invokableActionSet<RoleState, void, RoleState>(ROLE_PREFIX + 'Get Roles'),
  addRole: invokableActionSet<RoleState, Role, Role>(ROLE_PREFIX + 'Add Role'),
  updateRole: invokableActionSet<RoleState, Role, Role>(ROLE_PREFIX + 'Update Role'),
  removeRole: invokableActionSet<RoleState, Role, Role>(ROLE_PREFIX + 'Remove Role')
}
