import {Normalizable} from './normalize'
import {ObjMap} from "@revector/shared";


/**
 *
 */
export interface StateModel<S, N> extends Normalizable<S, N>{}


export interface StateMapModel<T,S, N> extends StateModel<S, N>{
  map:ObjMap<T>
}

