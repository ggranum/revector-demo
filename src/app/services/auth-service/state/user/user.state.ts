import {User, UserState, UserRoleMapping, UserRolesMappings, AuthServiceState} from '../../interfaces'
import {UserActions} from './user.actions'
import {TypedAction, ActionReducerSet} from '../../../../shared'
import {generatePushID} from '../../../../shared/firebase-generate-push-id'


export const userReducers = new ActionReducerSet<AuthServiceState>()

const USER_MAPPING = {
  toMapped: (state: AuthServiceState): UserState => {
    return state.users
  },
  fromMapped: (state: AuthServiceState, mapped: UserState): AuthServiceState => {
    state.users = mapped
    return state
  },
}


userReducers.registerMapped(UserActions.addUser.invoke,
  USER_MAPPING,
  (state: UserState, action: TypedAction<User>) => {
    let newState: UserState = Object.assign({}, state)
    let user = action.payload
    if (!user.uid) {
      user.uid = generatePushID()
      newState[user.uid] = user
    }
    return newState
  })

userReducers.registerMapped(UserActions.addUser.fulfilled,
  USER_MAPPING,
  (state: UserState, action: TypedAction<User>) => {
    return state
  })
userReducers.register(UserActions.addUser.failed)


userReducers.register(UserActions.getUsers.invoke)
userReducers.registerMapped(UserActions.getUsers.fulfilled,
  USER_MAPPING,
  (state: UserState, action: TypedAction<UserState>) => {
    state = Object.assign({}, action.payload)
    return state
  })
userReducers.registerError(UserActions.getUsers.failed)


userReducers.register(UserActions.updateUser.invoke)
userReducers.registerMapped(UserActions.updateUser.fulfilled,
  USER_MAPPING,
  (state: UserState, action: TypedAction<User>) => {
    return Object.assign({}, state, {[action.payload.uid]: action.payload})
  })
userReducers.registerError(UserActions.updateUser.failed)


userReducers.register(UserActions.removeUser.invoke)
userReducers.registerMapped(UserActions.removeUser.fulfilled,
  USER_MAPPING,
  (state: UserState, action: TypedAction<User>) => {
    let newState = Object.assign({}, state)
    delete newState[action.payload.uid]
    return newState
  })
userReducers.registerError(UserActions.removeUser.failed)


const USER_ROLE_MAPPING = {
  toMapped: (state: AuthServiceState): UserRolesMappings => {
    return state.user_roles
  },
  fromMapped: (state: AuthServiceState, mapped: UserRolesMappings): AuthServiceState => {
    state.user_roles = mapped
    return state
  },
}


userReducers.registerMapped(UserActions.addUserToRole.invoke,
  USER_ROLE_MAPPING,
  (state: UserRolesMappings, action: TypedAction<UserRoleMapping>) => {
    return state
  })
