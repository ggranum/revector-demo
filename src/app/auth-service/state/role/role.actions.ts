import {Action} from '@ngrx/store'
import {Role, RvError, AuthServiceState} from '../../interfaces'


export interface ReducerSignature<S,T> {
  (state: S, action: TypedAction<T>): S
}

export interface RegisterReducerSignature<S,T> {
  (reducers: any, reducer: ReducerSignature<S,T>): void
}

export interface SingleArgActionSignature<T> {
  (arg?:T): TypedAction<T>
}
export interface TypedActionDefinition<S, T> {
  type: string,
  action: SingleArgActionSignature<T>
  registerReducer: RegisterReducerSignature<S, T>
}

let registerReducer = function<S, T>(reducers:any, reducer:ReducerSignature<S, T>) {
  reducers[this.type] = reducer
}

export interface TypedAction<T> extends Action {
  payload: T
}

export interface ActionMethodSignature<T> {
  (x: T): TypedAction<T>
}

let a: ActionMethodSignature<Role> = (x: Role) => {
  return {
    type: '',
    payload: x
  }
}


export interface ActionDefinitionSignature {
  (): Action
}

export interface ActionDefinition<S> {
  type: string,
  action: ActionDefinitionSignature
  registerReducer: RegisterReducerSignature<S, Action>

}

let actionDefinition = function<S>(type: string):ActionDefinition<S> {
  return {
    type: type,
    action() {
      return {
        type: type
      }
    },
    registerReducer: registerReducer
  }
}

let typedActionDefinition = function<S, T>(type: string):TypedActionDefinition<S, T> {
  return {
    type: type,
    action(payload?:T) {
      return {
        type: type,
        payload: payload
      }
    },
    registerReducer: registerReducer
  }
}
export interface InvokableActionSet<S, I, F> {
  invoke: TypedActionDefinition<S, I>
  fulfilled: TypedActionDefinition<S, F>
  failed: TypedActionDefinition<S, RvError>
}
let invokableActionSet = function<S, I, F>(baseTypeKey:string):InvokableActionSet<S, I, F> {
  return {
    invoke: typedActionDefinition<S, I>(baseTypeKey + ' invoke'),
    fulfilled: typedActionDefinition<S, F>(baseTypeKey + '  fulfilled'),
    failed: typedActionDefinition<S, RvError>(baseTypeKey + '  failed')
  }
}

export interface RoleActionsIF {
  initialize: ActionDefinition<Map<string, Role>>
  getRoles: {
    invoke: TypedActionDefinition<Map<string, Role>, void>
    fulfilled: TypedActionDefinition<Map<string, Role>, Map<string,Role>>
    failed: TypedActionDefinition<Map<string, Role>, RvError>
  }
  addRole: {
    invoke: TypedActionDefinition<Map<string, Role>, Role>
    fulfilled: TypedActionDefinition<Map<string, Role>, Role>
    failed: TypedActionDefinition<Map<string, Role>, RvError>
  }
}

export let RoleActions: RoleActionsIF = {
  initialize: actionDefinition('[Auth.role] Initialize'),
  getRoles: invokableActionSet<Map<string, Role>, void, Map<string,Role>>('[Auth.role] Get Roles'),
  addRole: invokableActionSet<Map<string, Role>, Role, Role>('[Auth.role] Add Role')
}

