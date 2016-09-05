import {noCommitEnvironment} from './environment.local'

export const environment = Object.assign({
  production: false
}, noCommitEnvironment);
