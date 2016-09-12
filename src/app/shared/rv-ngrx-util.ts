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

export interface InvokableActionSet<S, I, M> {
  invoke: TypedActionDefinition<S, I>
  fulfilled: TypedActionDefinition<S, M>
  failed: TypedActionDefinition<S, RvError>
}

export const invokableActionSet = function<S, I, M>(baseTypeKey: string): InvokableActionSet<S, I, M> {
  return {
    invoke: typedActionDefinition<S, I>(baseTypeKey + ' invoke'),
    fulfilled: typedActionDefinition<S, M>(baseTypeKey + '  fulfilled'),
    failed: typedActionDefinition<S, RvError>(baseTypeKey + '  failed')
  }
}

export interface ReducerMapping<S,M> { toMapped: (S)=>M, fromMapped: (S, M)=>S }

interface ReducerEntry<S, M> {
  reducer: ReducerSignature<any, any>
  prefix: string
  mappedBy?: ReducerMapping<S,M>
}

let noOpReducer = (<S, T>(state: S, action: TypedAction<T>) => state )
let errorReducer = (<S>(state: S, action: TypedAction<RvError>) => {
  console.error(action.type = ": ", action.payload)
  return state
})

export class ActionReducerSet<S> {

  private _reducers: {[key: string]: ReducerEntry<any, any>} = {}

  constructor(private _initialState?: S) {
  }

  combine(...reducerSets:ActionReducerSet<S>[]):void{
    let reducers = reducerSets.map(set => set._reducers)
    Object.assign(this._reducers, ...reducers)
  }

  registerMapped<M,T>(actionDefinition: TypedActionDefinition<M,T>, mappedBy?: ReducerMapping<S,M>, reducer?: ReducerSignature<M,T>): void {
    this._reducers[actionDefinition.type] = {
      reducer: reducer || noOpReducer,
      mappedBy: mappedBy,
      prefix: actionDefinition.type.substr(0, actionDefinition.type.indexOf(']') + 1)
    }
  }


  /**
   * Register a reducer for an action definition. If a reducer is not provided this method
   * will register a no-op reducer in it's place (useful for suppressing 'missing reducer' warnings).
   */
  register<T>(actionDefinition: TypedActionDefinition<S,T>, reducer?: ReducerSignature<S,T>) {
    this.registerMapped(actionDefinition, null, reducer)
  }

  registerError(actionDefinition: TypedActionDefinition<S,RvError>) {
    this.register(actionDefinition, errorReducer)
  }

  reducer<T>(): (state: S, action: TypedAction<T>) => S {
    return <T>(state: S = this._initialState, action: TypedAction<T>): S => {
      console.log("ActionReducerSet", action.type)
      let newState: S = null
      let reducerEntry: ReducerEntry<S, any> = this._reducers[action.type]
      if (reducerEntry) {
        if (action.type.startsWith(reducerEntry.prefix)) {
          let tempState = state
          if(reducerEntry.mappedBy){
            tempState = reducerEntry.mappedBy.toMapped(state)
          }
          newState = reducerEntry.reducer(tempState, action)
          if(reducerEntry.mappedBy){
            newState = reducerEntry.mappedBy.fromMapped(state, newState)
          }
        }
      } else if(!action.type.startsWith('@ngrx')) {
        debugger
        console.log(`Missing reducer function for '${action.type}`, action)
      }
      return newState || state;
    }
  }


}
