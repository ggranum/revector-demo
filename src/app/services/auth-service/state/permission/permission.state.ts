import {ActionReducer} from '@ngrx/store'
import {Permission} from '../../interfaces'
import {PermissionActions} from './permission.actions'
import {TypedAction, ActionReducers, ObjMap} from '../../../../shared'
import {generatePushID} from '../../../../shared/firebase-generate-push-id'

let initialState: ObjMap<Permission> = {}


const actionReducers = new ActionReducers<ObjMap<Permission>>('[Auth.permission]', initialState)
export const PermissionReducer: ActionReducer<ObjMap<Permission>> = actionReducers.reducer()


actionReducers.register(PermissionActions.addPermission.invoke, (state: ObjMap<Permission>, action: TypedAction<Permission>) => {
  let newState = Object.assign({}, state)
  let permission = action.payload
  if (!permission.uid) {
    permission.uid = generatePushID()
    newState[permission.uid] = permission
  }
  return newState

})

actionReducers.register(PermissionActions.addPermission.fulfilled, (state: ObjMap<Permission>, action: TypedAction<Permission>) => {
  return state
})
actionReducers.register(PermissionActions.addPermission.failed)


actionReducers.register(PermissionActions.getPermissions.invoke)
actionReducers.register(PermissionActions.getPermissions.fulfilled, (state: ObjMap<Permission>, action: TypedAction<ObjMap<Permission>>) => {
  state = Object.assign({}, action.payload)
  return state
})
actionReducers.register(PermissionActions.getPermissions.failed)


actionReducers.register(PermissionActions.updatePermission.invoke)
actionReducers.register(PermissionActions.updatePermission.fulfilled, (state: ObjMap<Permission>, action: TypedAction<Permission>) => {
  return Object.assign({}, state, {[action.payload.uid]: action.payload})
})


actionReducers.register(PermissionActions.removePermission.invoke)
actionReducers.register(PermissionActions.removePermission.fulfilled, (state: ObjMap<Permission>, action: TypedAction<Permission>) => {
  let newState = Object.assign({}, state)
  delete newState[action.payload.uid]
  return newState
})


