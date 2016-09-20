import {User, AuthServiceSignInState, EmailPasswordCredentials} from '../../interfaces'
import {TypedActionDefinition, InvokableActionSet, typedActionDefinition, invokableActionSet} from '@revector/shared'

export const CURRENT_USER_PREFIX = '[Auth.current-user] '

export interface CurrentUserActionsIF {
  initialize: TypedActionDefinition<AuthServiceSignInState, User>
  signIn: InvokableActionSet<AuthServiceSignInState, EmailPasswordCredentials, User>
  signUp: InvokableActionSet<AuthServiceSignInState, EmailPasswordCredentials, User>
  signOut: InvokableActionSet<AuthServiceSignInState, User, void>

}
export const CurrentUserActions: CurrentUserActionsIF = {
  initialize: typedActionDefinition<AuthServiceSignInState, User>(CURRENT_USER_PREFIX + 'Initialize'),
  signIn: invokableActionSet<AuthServiceSignInState, EmailPasswordCredentials, User>(CURRENT_USER_PREFIX + 'Request Sign In'),
  signUp: invokableActionSet<AuthServiceSignInState, EmailPasswordCredentials, User>(CURRENT_USER_PREFIX + 'Request Sign Up'),
  signOut: invokableActionSet<AuthServiceSignInState, User, void>(CURRENT_USER_PREFIX + 'Request Sign Out'),
}

