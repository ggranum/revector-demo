import {User} from "./user"
import {SignInState} from "./sign-in-state"


export interface CurrentUserState {
  signInState?: SignInState
  currentUser?: User
}
