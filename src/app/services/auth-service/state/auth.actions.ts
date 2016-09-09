import {UserInfo, AuthServiceSignInState, EmailPasswordCredentials} from '../interfaces'
import {TypedActionDefinition, InvokableActionSet, typedActionDefinition, invokableActionSet} from '../../../shared'

const PREFIX = '[Auth.app] '

export interface AuthActionsIF {
  initialize: TypedActionDefinition<AuthServiceSignInState, UserInfo>
  signIn: InvokableActionSet<AuthServiceSignInState, EmailPasswordCredentials, UserInfo>
  signUp: InvokableActionSet<AuthServiceSignInState, EmailPasswordCredentials, UserInfo>
  signOut: InvokableActionSet<AuthServiceSignInState, UserInfo, void>

}
export const AuthActions: AuthActionsIF = {
  initialize: typedActionDefinition<AuthServiceSignInState, UserInfo>('[Auth.app] Initialize'),
  signIn: invokableActionSet<AuthServiceSignInState, EmailPasswordCredentials, UserInfo>(PREFIX + 'Request Sign In'),
  signUp: invokableActionSet<AuthServiceSignInState, EmailPasswordCredentials, UserInfo>(PREFIX + 'Request Sign Up'),
  signOut: invokableActionSet<AuthServiceSignInState, UserInfo, void>(PREFIX + 'Request Sign Out'),
}

