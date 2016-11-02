import {User, CurrentUserState, EmailPasswordCredentials} from '../../models'
import {TypedActionDefinition, InvokableActionSet, typedActionDefinition, invokableActionSet} from '@revector/shared'

export const CURRENT_USER_PREFIX = '[Auth.current-user] '

export interface CurrentUserActionsIF {
  initialize: TypedActionDefinition<CurrentUserState, User>
  signIn: InvokableActionSet<CurrentUserState, EmailPasswordCredentials, User>
  signUp: InvokableActionSet<CurrentUserState, EmailPasswordCredentials, User>
  signOut: InvokableActionSet<CurrentUserState, User, void>

}
export const CurrentUserActions: CurrentUserActionsIF = {
  initialize: typedActionDefinition<CurrentUserState, User>(CURRENT_USER_PREFIX + 'Initialize'),
  signIn: invokableActionSet<CurrentUserState, EmailPasswordCredentials, User>(CURRENT_USER_PREFIX + 'Request Sign In'),
  signUp: invokableActionSet<CurrentUserState, EmailPasswordCredentials, User>(CURRENT_USER_PREFIX + 'Request Sign Up'),
  signOut: invokableActionSet<CurrentUserState, User, void>(CURRENT_USER_PREFIX + 'Request Sign Out'),
}

