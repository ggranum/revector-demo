import {ActionReducer} from '@ngrx/store'
import {Role} from '../../interfaces'
import {RoleActions} from './role.actions'
import {TypedAction, ActionReducers, ObjMap} from '../../../../shared'
import {generatePushID} from '../../../../shared/firebase-generate-push-id'

let initialState: ObjMap<Role> = {}


const actionReducers = new ActionReducers<ObjMap<Role>>('[Auth.role]', initialState)
export const RoleReducer: ActionReducer<ObjMap<Role>> = actionReducers.reducer()


actionReducers.register(RoleActions.addRole.invoke, (state: ObjMap<Role>, action: TypedAction<Role>) => {
  let newState = Object.assign({}, state)
  let role = action.payload
  if (!role.uid) {
    role.uid = generatePushID()
    newState[role.uid] = role
  }
  return newState

})

actionReducers.register(RoleActions.addRole.fulfilled, (state: ObjMap<Role>, action: TypedAction<Role>) => {
  return state
})
actionReducers.register(RoleActions.addRole.failed)


actionReducers.register(RoleActions.getRoles.invoke)
actionReducers.register(RoleActions.getRoles.fulfilled, (state: ObjMap<Role>, action: TypedAction<ObjMap<Role>>) => {
  state = Object.assign({}, action.payload)
  return state
})
actionReducers.register(RoleActions.getRoles.failed)


actionReducers.register(RoleActions.updateRole.invoke)
actionReducers.register(RoleActions.updateRole.fulfilled, (state: ObjMap<Role>, action: TypedAction<Role>) => {
  return Object.assign({}, state, {[action.payload.uid]: action.payload})
})


actionReducers.register(RoleActions.removeRole.invoke)
actionReducers.register(RoleActions.removeRole.fulfilled, (state: ObjMap<Role>, action: TypedAction<Role>) => {
  let newState = Object.assign({}, state)
  delete newState[action.payload.uid]
  return newState
})


