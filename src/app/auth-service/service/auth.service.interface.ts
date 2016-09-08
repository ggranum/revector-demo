import {Observable} from "rxjs";
import {UserInfo} from '../interfaces'

export interface EmailPasswordCredentials {
  email: string,
  password: string
}



export interface UserAuthTokenIF {
  uid: string;
  auth: UserInfo
  expires?: number;
  anonymous?: boolean;
}

export abstract class AuthServiceCIF {
  globalEventObserver: () => Observable<UserAuthTokenIF>
  requestSignIn: (action: EmailPasswordCredentials) => Observable<UserInfo>
  requestSignUp: (action: EmailPasswordCredentials) => Observable<UserInfo>;
  populateNewAccountInfo: (user: UserInfo) => Observable<any>;
  updateAccountInfo: (user: UserInfo) => Observable<any>;
  logout: () => void;

  requestUsers: () => Observable<any>
}
