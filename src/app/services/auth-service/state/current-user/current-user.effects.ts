import {Injectable, OnDestroy} from '@angular/core'
import {Observable} from 'rxjs'
import {Store} from '@ngrx/store'

import {AuthServiceCIF, UserAuthTokenIF, EmailPasswordCredentials} from '../../service/auth.service.interface'
import {CurrentUserActions} from './current-user.actions'
import {AuthServiceStoreState, SignInStates, AuthServiceState, User} from '../../interfaces'
import {Actions, Effect} from '@ngrx/effects'
import {TypedAction} from '../../../../shared/rv-ngrx-util'


@Injectable()
export class CurrentUserEffects implements OnDestroy {

  appState: AuthServiceState

  constructor(private actions$: Actions, public store: Store<AuthServiceStoreState>, public authService: AuthServiceCIF) {
    authService.globalEventObserver().subscribe((authState: UserAuthTokenIF) => {
      this.globalAuthEventHandler(authState)
    })

    store.select((s: AuthServiceStoreState) => s.auth).subscribe((s: AuthServiceState) => this.appState = s, this.onError)
  }

  @Effect() requestSignIn$ = this.actions$
    .ofType(CurrentUserActions.signIn.invoke.type)
    .switchMap((action:TypedAction<EmailPasswordCredentials>) => this.requestSignIn(action.payload))


  @Effect() requestSignOut$ = this.actions$
    .ofType(CurrentUserActions.signOut.invoke.type)
    .switchMap(payload => this.requestSignOut())

  onError(e: Error): void {
    console.error("CurrentUserEffects", "onError", e)
  }

  requestSignIn(payload: EmailPasswordCredentials) {
    return this.authService.requestSignIn(payload).map(
      (userAuthInfo: User) => {
        return CurrentUserActions.signIn.fulfilled.action(userAuthInfo)
      },
      (e) => {
        return CurrentUserActions.signIn.failed.action(e)
      }
    )
  }


  onSigningUp(value: boolean) {
    // if (value === true) {
    //   this.authService.requestSignUp(this.appState.authToken).subscribe(
    //     (userAuthInfo: User) => {
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
    return Observable.of(CurrentUserActions.signOut.fulfilled.action())
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
    let user: User = <User>authState.auth
    this.store.dispatch(CurrentUserActions.initialize.action(user))
  }

  private handleAnonymousUser() {
    this.store.dispatch(CurrentUserActions.initialize.action(null))
  }


  public ngOnDestroy(): void {
  }

}
