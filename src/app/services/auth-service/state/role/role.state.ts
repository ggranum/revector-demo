import {Role, AuthServiceState, RoleHasPermissionGrantsRelation, RolePermission} from '../../models'
import {RoleActions} from './role.actions'
import {
  TypedAction,
  ActionReducerSet,
  Update,
  ObjMap
} from '@revector/shared'


export const roleReducers = new ActionReducerSet<AuthServiceState>()

const MAPPING = {
  toMapped: (state: AuthServiceState): ObjMap<Role> => {
    return state.roles
  },
  fromMapped: (state: AuthServiceState, mapped: ObjMap<Role>): AuthServiceState => {
    state.roles = mapped
    return state
  },
}

roleReducers.registerMapped(RoleActions.addRole.invoke, MAPPING, (state: ObjMap<Role>, action: TypedAction<Role>) => {
  let newState = Object.assign({}, state)
  let role = action.payload
  newState[role.$key] = role
  return newState
})

roleReducers.register(RoleActions.addRole.fulfilled)
roleReducers.register(RoleActions.addRole.failed)


roleReducers.register(RoleActions.getRoles.invoke)
roleReducers.registerMapped(RoleActions.getRoles.fulfilled, MAPPING, (state: ObjMap<Role>, action: TypedAction<ObjMap<Role>>) => {
  state = Object.assign({}, action.payload)
  return state
})
roleReducers.register(RoleActions.getRoles.failed)


roleReducers.registerMapped(RoleActions.updateRole.invoke, MAPPING, (state: ObjMap<Role>, action: TypedAction<Update<Role>>) => {
  let newState = Object.assign({}, state)
  delete newState[action.payload.previous.$key]
  newState[action.payload.current.$key] = Object.assign({}, action.payload.current)
  return newState
})
roleReducers.register(RoleActions.updateRole.fulfilled)
roleReducers.registerError(RoleActions.updateRole.failed)

roleReducers.register(RoleActions.removeRole.invoke)
roleReducers.registerMapped(RoleActions.removeRole.fulfilled,
  MAPPING,
  (state: ObjMap<Role>, action: TypedAction<Role>) => {
    let newState = Object.assign({}, state)
    delete newState[action.payload.$key]
    return newState
  })


const ROLE_PERMISSION_MAPPING = {
  toMapped: (state: AuthServiceState): RoleHasPermissionGrantsRelation => {
    return state.role_permissions
  },
  fromMapped: (state: AuthServiceState, mapped: RoleHasPermissionGrantsRelation): AuthServiceState => {
    state.role_permissions = mapped
    return state
  },
}

roleReducers.register(RoleActions.getRolePermissions.invoke)
roleReducers.registerMapped(RoleActions.getRolePermissions.fulfilled,
  ROLE_PERMISSION_MAPPING,
  (state: RoleHasPermissionGrantsRelation, action: TypedAction<RoleHasPermissionGrantsRelation>) => {
    return action.payload
  })
roleReducers.registerError(RoleActions.getRolePermissions.failed)

roleReducers.registerMapped(RoleActions.grantPermissionToRole.invoke,
  ROLE_PERMISSION_MAPPING,
  (state: RoleHasPermissionGrantsRelation, action: TypedAction<RolePermission>) => {
    let newState = state
    let roleId = action.payload.role_key
    let permissionId = action.payload.permission_key
    let rolePermissions = newState[roleId]
    if (!rolePermissions) {
      newState = Object.assign({}, state)
      rolePermissions = {}
    }
    let permission = rolePermissions[permissionId] || {}

    permission = Object.assign({}, permission, {
      name: action.payload.permission_key,
      explicitlyGranted: true
    })
    delete permission.explicitlyRevoked
    rolePermissions[permissionId] = permission
    newState[roleId] = rolePermissions

    return newState
  })
roleReducers.register(RoleActions.grantPermissionToRole.fulfilled)
roleReducers.registerError(RoleActions.grantPermissionToRole.failed)

roleReducers.registerMapped(RoleActions.revokePermissionFromRole.invoke,
  ROLE_PERMISSION_MAPPING,
  (state: RoleHasPermissionGrantsRelation, action: TypedAction<RolePermission>) => {
    let newState = state
    let roleId = action.payload.role_key
    let permissionId = action.payload.permission_key
    if (state[roleId] && state[roleId][permissionId]) {
      newState = Object.assign({}, state)
      delete state[roleId][permissionId]
    }
    return newState
  })
roleReducers.register(RoleActions.revokePermissionFromRole.fulfilled)
roleReducers.registerError(RoleActions.revokePermissionFromRole.failed)
