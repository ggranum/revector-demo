import {Permission, PermissionState, AuthServiceState} from '../../interfaces'
import {PermissionActions} from './permission.actions'
import {TypedAction, ActionReducerSet} from '../../../../shared'
import {generatePushID} from '../../../../shared/firebase-generate-push-id'

export const permissionReducers = new ActionReducerSet<AuthServiceState>()


const MAPPING = {
  toMapped: (state: AuthServiceState): PermissionState => {
    return state.permissions
  },
  fromMapped: (state: AuthServiceState, mapped: PermissionState): AuthServiceState => {
    state.permissions = mapped
    return state
  },
}


permissionReducers.registerMapped(PermissionActions.addPermission.invoke,
  MAPPING,
  (state: PermissionState, action: TypedAction<Permission>) => {
    let newState = Object.assign({}, state)
    let permission = action.payload
    if (!permission.uid) {
      permission.uid = generatePushID()
      newState[permission.uid] = permission
    }
    return newState
  })

permissionReducers.registerMapped(PermissionActions.addPermission.fulfilled,
  MAPPING,
  (state: PermissionState, action: TypedAction<Permission>) => {
    return state
  })
permissionReducers.register(PermissionActions.addPermission.failed)


permissionReducers.register(PermissionActions.getPermissions.invoke)
permissionReducers.registerMapped(PermissionActions.getPermissions.fulfilled,
  MAPPING,
  (state: PermissionState, action: TypedAction<PermissionState>) => {
    state = Object.assign({}, action.payload)
    return state
  })
permissionReducers.register(PermissionActions.getPermissions.failed)


permissionReducers.register(PermissionActions.updatePermission.invoke)
permissionReducers.registerMapped(PermissionActions.updatePermission.fulfilled,
  MAPPING,
  (state: PermissionState, action: TypedAction<Permission>) => {
    return Object.assign({}, state, {[action.payload.uid]: action.payload})
  })


permissionReducers.register(PermissionActions.removePermission.invoke)
permissionReducers.registerMapped(PermissionActions.removePermission.fulfilled, MAPPING, (state: PermissionState, action: TypedAction<Permission>) => {
  let newState = Object.assign({}, state)
  delete newState[action.payload.uid]
  return newState
})


