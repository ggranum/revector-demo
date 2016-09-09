import {Injectable, OnDestroy} from '@angular/core'
import {Observable} from 'rxjs'
import {Store} from '@ngrx/store'

import {AuthServiceCIF, UserAuthTokenIF, EmailPasswordCredentials} from '../service/auth.service.interface'
import {AuthActions} from './auth.actions'
import {AuthServiceStoreData, SignInStates, AuthServiceState, UserInfo} from '../interfaces'
import {Actions, Effect} from '@ngrx/effects'
import {TypedAction} from '../../../shared/rv-ngrx-util'


@Injectable()
export class AuthEffects implements OnDestroy {

  appState: AuthServiceState

  constructor(private actions$: Actions, public store: Store<AuthServiceStoreData>, public authService: AuthServiceCIF) {
    authService.globalEventObserver().subscribe((authState: UserAuthTokenIF) => {
      this.globalAuthEventHandler(authState)
    })

    store.select((s: AuthServiceStoreData) => s.auth).subscribe((s: AuthServiceState) => this.appState = s, this.onError)
  }

  @Effect() requestSignIn$ = this.actions$
    .ofType(AuthActions.signIn.invoke.type)
    .switchMap((action:TypedAction<EmailPasswordCredentials>) => this.requestSignIn(action.payload))


  @Effect() requestSignOut$ = this.actions$
    .ofType(AuthActions.signOut.invoke.type)
    .switchMap(payload => this.requestSignOut())

  onError(e: Error): void {
    console.error("AuthEffects", "onError", e)
  }

  requestSignIn(payload: EmailPasswordCredentials) {
    return this.authService.requestSignIn(payload).map(
      (userAuthInfo: UserInfo) => {
        return AuthActions.signIn.fulfilled.action(userAuthInfo)
      },
      (e) => {
        return AuthActions.signIn.failed.action(e)
      }
    )
  }


  onSigningUp(value: boolean) {
    // if (value === true) {
    //   this.authService.requestSignUp(this.appState.authToken).subscribe(
    //     (userAuthInfo: UserInfo) => {
    //       this.store.dispatch(this.appActions.requestSignUpFulfilled(userAuthInfo))
    //     },
    //     (e) => {
    //       this.store.dispatch(this.appActions.requestSignUpFailed(e))
    //     }
    //   )
    // }
  }

  onSignUpFulfilled(value: boolean) {
    // if (value === true) {
    //   this.authService.populateNewAccountInfo(this.appState.user).subscribe(
    //     () => {
    //     },
    //     (e) => {
    //       this.store.dispatch(this.appActions.requestSignUpFailed(e))
    //     }
    //   )
    // }
  }

  requestSignOut() {
    this.authService.logout()
    return Observable.of(AuthActions.signOut.fulfilled.action())
  }

  onRequestingUsers(value: boolean) {
    // if (value === true) {
    //   this.authService.requestUsers().subscribe((users: UsersIF) => {
    //     let x: UsersIF = {}
    //     Object.keys(users).forEach((key) => {
    //       if (key[0] != '$') {
    //         x[key] = users[key]
    //       }
    //     })
    //     this.store.dispatch(this.appActions.requestUsersFulfilled(x))
    //   }, (e) => {
    //     this.store.dispatch(this.appActions.requestUsersFailed(e))
    //   })
    //
    // }
  }

  private globalAuthEventHandler(authState: UserAuthTokenIF) {
    if (this.appState.transient.signInState.state == SignInStates.unknown) {
      if (authState && authState.auth) {
        this.handleUserRemembered(authState);
      } else {
        this.handleAnonymousUser()
      }
    }
  }

  private handleUserRemembered(authState: UserAuthTokenIF) {
    let user: UserInfo = <UserInfo>authState.auth
    this.store.dispatch(AuthActions.initialize.action(user))
  }

  private handleAnonymousUser() {
    this.store.dispatch(AuthActions.initialize.action(null))
  }


  public ngOnDestroy(): void {
  }

}

