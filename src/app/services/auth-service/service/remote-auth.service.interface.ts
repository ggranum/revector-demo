import {Observable} from 'rxjs'
import {User, EmailPasswordCredentials} from '../interfaces'

export interface UserAuthTokenIF {
  uid: string;
  auth: User
  expires?: number;
  anonymous?: boolean;
}


/**
 * CIF ==> Class-based-interface. Typescript allows implementing (instead of extending) classes. See use in
 * FirebaseAuthService
 */
export abstract class RemoteAuthServiceCIF {
  globalEventObserver: () => Observable<UserAuthTokenIF>
  requestSignIn: (action: EmailPasswordCredentials) => Observable<User>
  requestSignUp: (action: EmailPasswordCredentials) => Observable<User>;
  populateNewAccountInfo: (user: User) => Observable<any>;
  logout: () => void;

}
