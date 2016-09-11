import {ActionReducer} from '@ngrx/store'
import {User} from '../../interfaces'
import {UserActions} from './user.actions'
import {TypedAction, ActionReducers, ObjMap} from '../../../../shared'
import {generatePushID} from '../../../../shared/firebase-generate-push-id'

let initialState: ObjMap<User> = {}


const actionReducers = new ActionReducers<ObjMap<User>>('[Auth.user]', initialState)
export const UserReducer: ActionReducer<ObjMap<User>> = actionReducers.reducer()


actionReducers.register(UserActions.addUser.invoke, (state: ObjMap<User>, action: TypedAction<User>) => {
  let newState = Object.assign({}, state)
  let user = action.payload
  if (!user.uid) {
    user.uid = generatePushID()
    newState[user.uid] = user
  }
  return newState

})

actionReducers.register(UserActions.addUser.fulfilled, (state: ObjMap<User>, action: TypedAction<User>) => {
  return state
})
actionReducers.register(UserActions.addUser.failed)


actionReducers.register(UserActions.getUsers.invoke)
actionReducers.register(UserActions.getUsers.fulfilled, (state: ObjMap<User>, action: TypedAction<ObjMap<User>>) => {
  state = Object.assign({}, action.payload)
  return state
})
actionReducers.registerError(UserActions.getUsers.failed)


actionReducers.register(UserActions.updateUser.invoke)
actionReducers.register(UserActions.updateUser.fulfilled, (state: ObjMap<User>, action: TypedAction<User>) => {
  return Object.assign({}, state, {[action.payload.uid]: action.payload})
})
actionReducers.registerError(UserActions.updateUser.invoke)



actionReducers.register(UserActions.removeUser.invoke)
actionReducers.register(UserActions.removeUser.fulfilled, (state: ObjMap<User>, action: TypedAction<User>) => {
  let newState = Object.assign({}, state)
  delete newState[action.payload.uid]
  return newState
})
actionReducers.registerError(UserActions.removeUser.failed)

