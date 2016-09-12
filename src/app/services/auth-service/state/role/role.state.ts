import {Role, RoleState, AuthServiceState} from '../../interfaces'
import {RoleActions} from './role.actions'
import {TypedAction, ActionReducerSet} from '../../../../shared'
import {generatePushID} from '../../../../shared/firebase-generate-push-id'


export const roleReducers = new ActionReducerSet<AuthServiceState>()

const MAPPING = {
  toMapped: (state: AuthServiceState): RoleState => {
    return state.roles
  },
  fromMapped: (state: AuthServiceState, mapped: RoleState): AuthServiceState => {
    state.roles = mapped
    return state
  },
}

roleReducers.registerMapped(RoleActions.addRole.invoke, MAPPING,  (state:  RoleState, action: TypedAction<Role>) => {
  let newState = Object.assign({}, state)
  let role = action.payload
  if (!role.uid) {
    role.uid = generatePushID()
    newState[role.uid] = role
  }
  return newState
})

roleReducers.registerMapped(RoleActions.addRole.fulfilled, MAPPING,  (state:  RoleState, action: TypedAction<Role>) => {
  return state
})
roleReducers.register(RoleActions.addRole.failed)


roleReducers.register(RoleActions.getRoles.invoke)
roleReducers.registerMapped(RoleActions.getRoles.fulfilled, MAPPING,  (state:  RoleState, action: TypedAction<RoleState>) => {
  state = Object.assign({}, action.payload)
  return state
})
roleReducers.register(RoleActions.getRoles.failed)


roleReducers.register(RoleActions.updateRole.invoke)
roleReducers.registerMapped(RoleActions.updateRole.fulfilled, MAPPING,  (state:  RoleState, action: TypedAction<Role>) => {
  return Object.assign({}, state, {[action.payload.uid]: action.payload})
})


roleReducers.register(RoleActions.removeRole.invoke)
roleReducers.registerMapped(RoleActions.removeRole.fulfilled,
  MAPPING,
  (state: RoleState, action: TypedAction<Role>) => {
  let newState = Object.assign({}, state)
  delete newState[action.payload.uid]
  return newState
})


