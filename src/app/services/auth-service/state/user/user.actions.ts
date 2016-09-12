import {User, UserRoleMapping, UserState, UserRolesMappings} from '../../interfaces'
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
  addUserToRole: InvokableActionSet<UserRolesMappings, UserRoleMapping, UserRoleMapping>
}

export let UserActions: UserActionsIF = {
  initialize: actionDefinition(USER_PREFIX + 'Initialize'),
  getUsers: invokableActionSet<UserState, void, UserState>(USER_PREFIX + 'Get Users'),
  addUser: invokableActionSet<UserState, User, User>(USER_PREFIX + 'Add User'),
  updateUser: invokableActionSet<UserState, User, User>(USER_PREFIX + 'Update User'),
  removeUser: invokableActionSet<UserState, User, User>(USER_PREFIX + 'Remove User'),
  addUserToRole: invokableActionSet<UserRolesMappings, UserRoleMapping, UserRoleMapping>(USER_PREFIX + 'Add user to role')

}
