// Base Angular2
import {BrowserModule} from '@angular/platform-browser'
import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {AngularFireModule, AuthMethods, AuthProviders} from 'angularfire2'

// NG RX
import {StoreDevtoolsModule} from '@ngrx/store-devtools'
import {StoreLogMonitorModule, useLogMonitor} from '@ngrx/store-log-monitor'
import {StoreModule} from '@ngrx/store'
import {EffectsModule} from '@ngrx/effects';

// Dev modules
import {AuthModule, AuthReducers} from './'


// Our Components
import {environment} from '../../../environments/environment';
import {CurrentUserEffects, RoleEffects, PermissionEffects, UserEffects} from './state'

const firebaseConfig = environment.firebaseConfig

const firebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}

let reducers = {
  auth: AuthReducers
}

@NgModule({
  declarations: [],
  imports: [
    /* Dev modules */
    AuthModule,

    /* Firebase Modules */
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig),

    /* NgRx */
    StoreModule.provideStore(reducers),
    StoreDevtoolsModule.instrumentStore({monitor: useLogMonitor({visible: true, position: 'left'})}),
    StoreLogMonitorModule,
    EffectsModule.run(CurrentUserEffects),
    EffectsModule.run(RoleEffects),
    EffectsModule.run(PermissionEffects),
    EffectsModule.run(UserEffects),

    /* Ng2 Modules. */
    BrowserModule,
    CommonModule,
  ],
  providers: [],
  entryComponents: [],
  bootstrap: []
})
export class AppModule {

  constructor() {
  }
}
