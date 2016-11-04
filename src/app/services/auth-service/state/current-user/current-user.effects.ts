import {
  Injectable,
  OnDestroy
} from '@angular/core'
import {Observable} from 'rxjs'
import {Store} from '@ngrx/store'
import {
  Actions,
  Effect
} from '@ngrx/effects'

import {TypedAction} from '@revector/shared'
//noinspection TypeScriptPreferShortImport
import {
  RemoteAuthServiceCIF,
  UserAuthTokenIF
} from '../../service/remote-auth.service.interface'
import {
  AuthStoreState,
  SignInStates,
  AuthServiceState,
  User,
  EmailPasswordCredentials
} from '../../interfaces'
import {CurrentUserActions} from './current-user.actions'


@Injectable()
export class CurrentUserEffects implements OnDestroy {

  appState: AuthServiceState

  // noinspection JSUnusedGlobalSymbols
  @Effect() requestSignIn$ = this.actions$
    .ofType(CurrentUserActions.signIn.invoke.type)
    .switchMap((action: TypedAction<EmailPasswordCredentials>) => this.requestSignIn(action.payload))

  // noinspection JSUnusedGlobalSymbols
  @Effect() requestSignOut$ = this.actions$
    .ofType(CurrentUserActions.signOut.invoke.type)
    .switchMap(action => this.requestSignOut())

  // noinspection JSUnusedGlobalSymbols
  @Effect() requestSignUp$ = this.actions$
    .ofType(CurrentUserActions.signUp.invoke.type)
    .switchMap((action: TypedAction<EmailPasswordCredentials>) => this.requestSignUp(action.payload))

  // noinspection JSUnusedGlobalSymbols
  @Effect({dispatch: false}) requestSignUpFulfilled$ = this.actions$
    .ofType(CurrentUserActions.signUp.fulfilled.type)
    .switchMap((action: TypedAction<User>) => this.requestSignUpFulfilled(action.payload))

  constructor(private actions$: Actions, public store: Store<AuthStoreState>, public authService: RemoteAuthServiceCIF) {
    authService.globalEventObserver().subscribe((authState: UserAuthTokenIF) => {
      this.globalAuthEventHandler(authState)
    })

    store.select((s: AuthStoreState) => s.auth).subscribe((s: AuthServiceState) => this.appState = s, this.onError)
  }

  onError(e: Error): void {
    console.error('CurrentUserEffects', 'onError', e)
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


  requestSignUp(payload: EmailPasswordCredentials) {
    return this.authService.requestSignUp(payload).map(
      (userAuthInfo: User) => {
        return CurrentUserActions.signUp.fulfilled.action(userAuthInfo)
      },
      (e) => {
        return CurrentUserActions.signUp.failed.action(e)
      }
    )
  }

  requestSignUpFulfilled(user: User) {
    return this.authService.populateNewAccountInfo(user).map(
      () => {
        return Observable.of(true)
      },
      (e) => {
        return Observable.of(false)
      }
    )
  }

  requestSignOut() {
    this.authService.logout()
    return Observable.of(CurrentUserActions.signOut.fulfilled.action())
  }


  private globalAuthEventHandler(authState: UserAuthTokenIF) {
    if (this.appState.transient.signInState.state === SignInStates.unknown) {
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

