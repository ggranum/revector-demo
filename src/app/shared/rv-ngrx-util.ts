import {Action} from '@ngrx/store'
import {RvError} from './core-util'


export interface ReducerSignature<S,T> {
  (state: S, action: TypedAction<T>): S
}

export interface TypedActionFactorySignature<T> {
  (arg?: T): TypedAction<T>
}
export interface TypedActionDefinition<S, T> {
  type: string,
  action: TypedActionFactorySignature<T>
}

export interface TypedAction<T> extends Action {
  payload: T
}

export interface ActionDefinitionSignature {
  (): Action
}

export interface ActionDefinition<S> {
  type: string,
  action: ActionDefinitionSignature
}

export const actionDefinition = function<S>(type: string): ActionDefinition<S> {
  return {
    type: type,
    action() {
      return {
        type: type
      }
    }
  }
}

export const typedActionDefinition = function<S, T>(type: string): TypedActionDefinition<S, T> {
  return {
    type: type,
    action(payload?: T) {
      return {
        type: type,
        payload: payload
      }
    }
  }
}

export interface InvokableActionSet<S, I, F> {
  invoke: TypedActionDefinition<S, I>
  fulfilled: TypedActionDefinition<S, F>
  failed: TypedActionDefinition<S, RvError>
}

export const invokableActionSet = function<S, I, F>(baseTypeKey: string): InvokableActionSet<S, I, F> {
  return {
    invoke: typedActionDefinition<S, I>(baseTypeKey + ' invoke'),
    fulfilled: typedActionDefinition<S, F>(baseTypeKey + '  fulfilled'),
    failed: typedActionDefinition<S, RvError>(baseTypeKey + '  failed')
  }
}

export class ActionReducers<S> {

  private _reducers: {[key: string]: ReducerSignature<S, any>} = {}

  constructor(private _prefix: string, private _initialState: S) {
  }

  /**
   * Register a reducer for an action definition. If a reducer is not provided this method
   * will register a no-op reducer in it's place (useful for suppressing 'missing reducer' warnings).
   */
  register<T>(actionDefinition: TypedActionDefinition<S,T>, reducer?: ReducerSignature<S,T>) {
    this._reducers[actionDefinition.type] = reducer || ((state: S, action: TypedAction<T>) => state)
  }

  registerError<T>(actionDefinition: TypedActionDefinition<S,T>) {
    this._reducers[actionDefinition.type] = ((state: S, action: TypedAction<RvError>) => {
      console.error(action.type = ": ",  action.payload)
      return state
    })
  }

  reducer<T>(): (state: S, action: TypedAction<T>) => S {
    return <T>(state: S = this._initialState, action: TypedAction<T>): S => {
      let newState: S = null
      if (action.type.startsWith(this._prefix)) {
        let reducer: ReducerSignature<S, any> = this._reducers[action.type]
        if (reducer) {
          newState = reducer(state, action)
        } else {
          console.log(`Missing reducer function for '${action.type}`, action)
        }
      }
      return newState || state;
    }
  }


}
