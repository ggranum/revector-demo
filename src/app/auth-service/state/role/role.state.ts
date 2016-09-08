import {ActionReducer} from '@ngrx/store'
import {AuthServiceState, Role, RvError} from '../../interfaces'
import {RoleActions, TypedAction, ReducerSignature} from './role.actions'

let InitialState: Map<string, Role> = new Map<string, Role>()


let Reducers: {[key: string]: ReducerSignature<Map<string, Role>, any>} = {}

export const RoleReducer: ActionReducer<Map<string, Role>> = (state = InitialState, action: TypedAction<any>) => {
  let newState: Map<string, Role> = null
  if (action.type.startsWith("[Auth.role]")) {
    let reducer: ReducerSignature<Map<string, Role>, any> = Reducers[action.type]
    if (reducer) {
      newState = reducer(state, action)
    } else {
      console.log(`Missing reducer function for '${action.type}`, action)
    }
  }
  return newState || state;
}

RoleActions.addRole.invoke.registerReducer(Reducers, (state: Map<string, Role>, action: TypedAction<Role>) => {
  return state
})

RoleActions.getRoles.invoke.registerReducer(Reducers, (state: Map<string, Role>, action: TypedAction<void>) => {
  return state
})
RoleActions.getRoles.fulfilled.registerReducer(Reducers, (state: Map<string, Role>, action: TypedAction<Map<string,Role>>) => {
  state = action.payload
  return state
})

RoleActions.getRoles.failed.registerReducer(Reducers, (state: Map<string, Role>, action: TypedAction<RvError>) => {
  return state
})


