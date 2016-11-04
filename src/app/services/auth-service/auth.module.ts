import {NgModule, SkipSelf, Optional} from '@angular/core'
import {CommonModule} from '@angular/common'
import {CurrentUserEffects, UserEffects, RoleEffects, PermissionEffects} from './state/'
import {RemoteAuthServiceCIF, FirebaseAuthService} from './service/'

/**
 * State management (including persistence) for Authentication and Authorization.
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    CurrentUserEffects,
    RoleEffects,
    UserEffects,
    PermissionEffects,
    {provide: RemoteAuthServiceCIF, useClass: FirebaseAuthService},
  ],
  exports: []
})
export class AuthModule {

  constructor(public effects: CurrentUserEffects, @Optional() @SkipSelf() parentModule: AuthModule) {
    if (parentModule) {
      throw new Error(
        'AuthModule is already loaded. Import it in the AppModule only')
    }
  }
}
