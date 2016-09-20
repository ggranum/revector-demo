import {Observable} from 'rxjs'
import {User} from '../interfaces'

export interface EmailPasswordCredentials {
  email: string,
  password: string
}


export interface UserAuthTokenIF {
  uid: string;
  auth: User
  expires?: number;
  anonymous?: boolean;
}

export abstract class AuthServiceCIF {
  globalEventObserver: () => Observable<UserAuthTokenIF>
  requestSignIn: (action: EmailPasswordCredentials) => Observable<User>
  requestSignUp: (action: EmailPasswordCredentials) => Observable<User>;
  populateNewAccountInfo: (user: User) => Observable<any>;
  updateAccountInfo: (user: User) => Observable<any>;
  logout: () => void;

  requestUsers: () => Observable<any>
}
