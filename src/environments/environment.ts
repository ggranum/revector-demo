// The file for the current environment will overwrite this one during build.
// Different environments can be found in ./environment.{dev|prod}.ts, and
// you can create your own and use it with the --env flag.
// The build system defaults to the dev environment.
import {noCommitEnvironment} from './environment.local'

export const environment = Object.assign({
  production: true
}, noCommitEnvironment);

