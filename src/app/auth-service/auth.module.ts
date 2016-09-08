import {NgModule, SkipSelf, Optional} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AuthEffects, AuthActions, RoleEffects} from "./state/index";
import {AuthServiceCIF, FirebaseAuthService} from "./service/index";


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    AuthActions,
    AuthEffects,
    RoleEffects,
    {provide: AuthServiceCIF, useClass: FirebaseAuthService},
  ],
  exports: [ ]
})
export class AuthModule {

  constructor(public effects:AuthEffects, @Optional() @SkipSelf() parentModule: AuthModule) {
    if (parentModule) {
      throw new Error(
        'AuthModule is already loaded. Import it in the AppModule only');
    }
  }
}