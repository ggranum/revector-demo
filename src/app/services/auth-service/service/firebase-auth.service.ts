import {AngularFire, AngularFireAuth, FirebaseAuthState, AuthMethods, AuthProviders} from 'angularfire2'
import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
//noinspection TypeScriptPreferShortImport
import {RemoteAuthServiceCIF, UserAuthTokenIF} from './remote-auth.service.interface'
import {User, EmailPasswordCredentials} from '../interfaces'

const defaultAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password,
}

@Injectable()
export class FirebaseAuthService implements RemoteAuthServiceCIF {

  private _auth: AngularFireAuth
  private _fbRoot: string = '/auth'

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
        throw new Error('Unknown error.')
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
        throw new Error('Unknown error.')
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
    let info = this.angularFire.database.object(`${this._fbRoot}/users/${user.uid}`)
    let p = <Promise<any>>info.set(user)
    return Observable.fromPromise(p)
  }

  logout(): void {
    this._auth.logout()
  }

  globalEventObserver(): Observable<UserAuthTokenIF> {
    return this._auth.map((fbAuthState: FirebaseAuthState) => {
      let result: UserAuthTokenIF = null
      if (fbAuthState && fbAuthState.auth) {
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

