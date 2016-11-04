import {Permission, AuthServiceState} from '../../interfaces'
import {PermissionActions} from './permission.actions'
import {
  Update,
  TypedAction,
  ActionReducerSet,
  ObjMap
} from '@revector/shared'

export const permissionReducers = new ActionReducerSet<AuthServiceState>()


const MAPPING = {
  toMapped: (state: AuthServiceState): ObjMap<Permission> => {
    return state.permissions
  },
  fromMapped: (state: AuthServiceState, mapped: ObjMap<Permission>): AuthServiceState => {
    state.permissions = mapped
    return state
  },
}

/**
 * getPermissions.invoke: Permissions don't changes on invoke
 * @todo ggranum: add a transient 'loadingPermissions' flag.
 */
permissionReducers.register(PermissionActions.getPermissions.invoke)


/**
 * getPermissions.fulfilled: Value(s) has returned from the service (made from 'permission.effects.ts', in this case)
 */
permissionReducers.registerMapped(PermissionActions.getPermissions.fulfilled,
  MAPPING,
  (state: ObjMap<Permission>, action: TypedAction<ObjMap<Permission>>) => {
    state = Object.assign({}, action.payload)
    return state
  })

/**
 * getPermissions.failed: Request failed
 * @todo ggranum: Implement error handling.
 */
permissionReducers.register(PermissionActions.getPermissions.failed)


permissionReducers.registerMapped(PermissionActions.addPermission.invoke,
  MAPPING,
  (state: ObjMap<Permission>, action: TypedAction<Permission>) => {
    let newState = Object.assign({}, state)
    let permission = action.payload
    newState[permission.$key] = permission
    return newState
  })


permissionReducers.registerMapped(PermissionActions.addPermission.fulfilled,
  MAPPING,
  (state: ObjMap<Permission>, action: TypedAction<Permission>) => {
    return state
  })
permissionReducers.register(PermissionActions.addPermission.failed)


permissionReducers.register(PermissionActions.updatePermission.invoke)
permissionReducers.registerMapped(PermissionActions.updatePermission.fulfilled,
  MAPPING,
  (state: ObjMap<Permission>, action: TypedAction<Update<Permission>>) => {
    let newState = Object.assign({}, state)
    delete newState[action.payload.previous.$key]
    newState[action.payload.current.$key] = action.payload.current
    return newState
  })

permissionReducers.register(PermissionActions.removePermission.invoke)
permissionReducers.registerMapped(PermissionActions.removePermission.fulfilled,
  MAPPING,
  (state: ObjMap<Permission>, action: TypedAction<Permission>) => {
  let newState = Object.assign({}, state)
  delete newState[action.payload.$key]
  return newState
})


