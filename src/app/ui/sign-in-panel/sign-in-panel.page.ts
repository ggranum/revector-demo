import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core'
import {
  Params,
  Router,
  ActivatedRoute
} from "@angular/router";
import {safe} from "@revector/shared";
import {
  AuthStoreState,
  User,
  SignInState,
  SignInStates
} from "@revector/auth-service";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";

@Component({
  selector: 'rv-sign-in-panel-page',
  template: `
<div class='sign-in-page-content' layout="row" layout-align="center start">
  <rv-sign-in-panel ></rv-sign-in-panel>
</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SignInPanelPage {
  private redirectTo: string

  signInState$: Observable<SignInState>
  user$: Observable<User>

  constructor(private route: ActivatedRoute, private router: Router, private _store: Store<AuthStoreState>) {
    this.signInState$ = _store.select((s: AuthStoreState) => safe(() => s.auth.transient.signInState))
    this.user$ = _store.select((s: AuthStoreState) => safe(() => s.auth.transient.currentUser))
  }


  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.redirectTo = params['redirect']
    });

    let sub = this.signInState$.subscribe((signInState: SignInState) => {
        if (signInState.state == SignInStates.signedIn) {
          if (sub) {
            sub.unsubscribe()
          }
          this.onSignInSuccess()
        }
      }
    )
  }

  onSignInSuccess(){
    this.router.navigate([this.redirectTo || '/'])
  }
}
