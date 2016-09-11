import {User} from '../../interfaces'
import {
  ObjMap,
  ActionDefinition, InvokableActionSet, actionDefinition,
  invokableActionSet
} from '../../../../shared'


export interface UserActionsIF {
  initialize: ActionDefinition<ObjMap<User>>
  getUsers: InvokableActionSet<ObjMap<User>, void, ObjMap<User>>
  addUser: InvokableActionSet<ObjMap<User>, User, User>
  updateUser: InvokableActionSet<ObjMap<User>, User, User>
  removeUser: InvokableActionSet<ObjMap<User>, User, User>
}

export let UserActions: UserActionsIF = {
  initialize: actionDefinition('[Auth.user] Initialize'),
  getUsers: invokableActionSet<ObjMap<User>, void, ObjMap<User>>('[Auth.user] Get Users'),
  addUser: invokableActionSet<ObjMap<User>, User, User>('[Auth.user] Add User'),
  updateUser: invokableActionSet<ObjMap<User>, User, User>('[Auth.user] Update User'),
  removeUser: invokableActionSet<ObjMap<User>, User, User>('[Auth.user] Remove User')
}
