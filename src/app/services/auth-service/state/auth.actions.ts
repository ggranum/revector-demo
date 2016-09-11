import {User, AuthServiceSignInState, EmailPasswordCredentials} from '../interfaces'
import {TypedActionDefinition, InvokableActionSet, typedActionDefinition, invokableActionSet} from '../../../shared'

const PREFIX = '[Auth.app] '

export interface AuthActionsIF {
  initialize: TypedActionDefinition<AuthServiceSignInState, User>
  signIn: InvokableActionSet<AuthServiceSignInState, EmailPasswordCredentials, User>
  signUp: InvokableActionSet<AuthServiceSignInState, EmailPasswordCredentials, User>
  signOut: InvokableActionSet<AuthServiceSignInState, User, void>

}
export const AuthActions: AuthActionsIF = {
  initialize: typedActionDefinition<AuthServiceSignInState, User>('[Auth.app] Initialize'),
  signIn: invokableActionSet<AuthServiceSignInState, EmailPasswordCredentials, User>(PREFIX + 'Request Sign In'),
  signUp: invokableActionSet<AuthServiceSignInState, EmailPasswordCredentials, User>(PREFIX + 'Request Sign Up'),
  signOut: invokableActionSet<AuthServiceSignInState, User, void>(PREFIX + 'Request Sign Out'),
}

