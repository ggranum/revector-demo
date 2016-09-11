import {AngularFire, AngularFireAuth, FirebaseAuthState, AuthMethods, AuthProviders} from "angularfire2";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AuthServiceCIF, UserAuthTokenIF, EmailPasswordCredentials} from "./auth.service.interface";
import {User} from '../interfaces'

const defaultAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password,
}

@Injectable()
export class FirebaseAuthService implements AuthServiceCIF {

  private _auth: AngularFireAuth
  private _fbRoot:string = '/auth'

  constructor(public angularFire: AngularFire) {
    this._auth = angularFire.auth
  }

  requestSignIn(payload: EmailPasswordCredentials): Observable<User> {
    let loginCfg = {
      email: payload.email,
      password: payload.password
    }
    let promise: Promise<any> = <Promise<any>>this._auth.login(loginCfg, defaultAuthConfig)
    let response = promise.then((fbAuthState: FirebaseAuthState) => {
      if (fbAuthState != null) {
        return this.userFromAuth(<User>fbAuthState.auth)
      } else {
        throw new Error("Unknown error.")
      }
    }, (e: Error) => {
      throw e
    })
    return Observable.fromPromise(response)
  }

  requestSignUp(payload: EmailPasswordCredentials): Observable<User> {
    let promise: Promise<any> = <Promise<any>>this._auth.createUser(payload)
    let response = promise.then((fbAuthState: FirebaseAuthState) => {
      if (fbAuthState != null) {
        return this.userFromAuth(<User>fbAuthState.auth)
      } else {
        throw new Error("Unknown error.")
      }
    }, (e: Error) => {
      throw e
    })
    return Observable.fromPromise(response)
  }

  requestUsers(): Observable<any> {
    return this.angularFire.database.object(`${this._fbRoot}/users/`)
  }

  populateNewAccountInfo(user: User): Observable<any> {
    let p = <Promise<any>>this.angularFire.database.object(`${this._fbRoot}/users/${user.uid}`).set({
      uid: user.uid,
      info: user
    })
    return Observable.fromPromise(p)
  }

  updateAccountInfo(user: User): Observable<any> {
    let info = this.angularFire.database.object(`${this._fbRoot}/users/${user.uid}/info`)
    let p = <Promise<any>>info.set(user)
    return Observable.fromPromise(p)
  }

  logout(): void {
    this._auth.logout()
  }

  globalEventObserver(): Observable<UserAuthTokenIF> {
    return this._auth.map((fbAuthState: FirebaseAuthState) => {
      let result:UserAuthTokenIF = null
      if(fbAuthState && fbAuthState.auth){
        result = Object.assign({}, <UserAuthTokenIF>fbAuthState)
        result.auth = this.userFromAuth(<User>fbAuthState.auth)
      }
      return result
    })
  }

  private userFromAuth(fbAuth: User): User {
    return {
      lastSignInIp: '',
      lastSignInMils: Date.now(),
      createdMils: fbAuth.createdMils || Date.now(),
      displayName: fbAuth.displayName,
      email: fbAuth.email,
      emailVerified: fbAuth.emailVerified,
      isAnonymous: fbAuth.isAnonymous,
      photoURL: fbAuth.photoURL,
      uid: fbAuth.uid,
    }
  }
}

/**
 *
 * Lightly modified from the firebase docs: https://www.firebase.com/docs/web/guide/user-auth.html
 * Hopefully only developers ever see these first few:
 *
 * Regarding 'Invalid_Password': An attacker can verify that an account exists by trying to create an account, so no point in pretending.
 * If you believe otherwise, you're wrong. But feel free to change the message! ;~)
 */
const rsrc = {
  "AUTHENTICATION_DISABLED": "The requested authentication provider is disabled.",
  "INVALID_CONFIGURATION": "The requested authentication provider is misconfigured, and the request cannot complete. Please confirm that the provider's client ID and secret are correct in your Firebase Dashboard and the app is properly set up on the provider's website.",
  "INVALID_PROVIDER": "The requested authentication provider does not exist. Please consult the Firebase authentication documentation for a list of supported providers.",
  "INVALID_TOKEN": "The specified authentication token is invalid. This can occur when the token is malformed, expired, or the Firebase secret that was used to generate it has been revoked.",
  "PROVIDER_ERROR": "A third-party provider error occurred. Please refer to the error message and error details for more information.",
  "TRANSPORT_UNAVAILABLE": "The requested login method is not available in the user's browser environment. Popups are not available in Chrome for iOS, iOS Preview Panes, or local, file:// URLs. Redirects are not available in PhoneGap / Cordova, or local, file:// URLs.",
  "UNKNOWN_ERROR": "An unknown error occurred. Please refer to the error message and error details for more information.",
  "USER_CANCELLED": "The current authentication request was cancelled by the user.",
  "USER_DENIED": "The user did not authorize the application. This error can occur when the user has cancelled an OAuth authentication request.",

  /* User facing messages: */
  "EMAIL_TAKEN": "That email address is already in use.",
  "INVALID_ARGUMENTS": "The specified username or password is malformed or incomplete.",
  "INVALID_CREDENTIALS": "Your password has expired and needs to be reset.",
  "INVALID_EMAIL": "The specified email is not a valid email.",
  "INVALID_ORIGIN": "Warning! Your connection may not be secure. If you are in a public location you should avoid performing any further sensitive browsing until you've changed connections.",
  "INVALID_USER": "We don't have an account listed under that email address.",
  "INVALID_PASSWORD": "The password you entered is incorrect.",
  "NETWORK_ERROR": "An error occurred while attempting to contact the authentication server."
}
