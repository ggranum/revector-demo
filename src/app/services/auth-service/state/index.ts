import {ActionReducerSet} from '../../../shared/rv-ngrx-util'
import {AuthServiceState, SignInStates} from '../interfaces'
import {userReducers} from './user/user.state'
import {currentUserReducers} from './current-user/current-user.state'
import {permissionReducers} from './permission/permission.state'
import {roleReducers} from './role/role.state'
export * from './current-user/current-user.state'
export * from './current-user/current-user.effects'
export * from './current-user/current-user.actions'

export * from './role/role.state'
export * from './role/role.actions'
export * from './role/role.effects'

export * from './permission/permission.state'
export * from './permission/permission.actions'
export * from './permission/permission.effects'

export * from './user/user.state'
export * from './user/user.actions'
export * from './user/user.effects'


const initialState: AuthServiceState = {
  transient: {
    signInState: {state: SignInStates.unknown}
  },
  users: {},
  roles: {},
  permissions: {},
  role_permissions: {},
  user_permissions: {},
  user_roles: {},
}
const authReducerSet: ActionReducerSet<AuthServiceState> = new ActionReducerSet<AuthServiceState>(initialState);

authReducerSet.combine(currentUserReducers, roleReducers, permissionReducers, userReducers)

export const AuthReducers = authReducerSet.reducer()
