import {Observable} from 'rxjs'
import {User, EmailPasswordCredentials} from '../models'

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
  logout: () => void;

}
