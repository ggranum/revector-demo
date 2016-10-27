// Base Angular2
import {BrowserModule} from '@angular/platform-browser'
import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {
  AngularFireModule,
  AuthMethods,
  AuthProviders
} from 'angularfire2'

// Material design
import { MaterialModule } from '@angular/material'

// NG RX
import {StoreDevtoolsModule} from '@ngrx/store-devtools'
import {
  StoreLogMonitorModule,
  useLogMonitor
} from '@ngrx/store-log-monitor'
import {StoreModule} from '@ngrx/store'
import {EffectsModule} from '@ngrx/effects';

// Dev modules
import {RvAsciidoctorPanelModule} from '@revector/asciidoctor-panel';
import {
  AuthModule,
  AuthReducers,
  CurrentUserEffects,
  RoleEffects,
  PermissionEffects,
  UserEffects
} from '@revector/auth-service'
import {AdminUiModule} from "@revector/admin-ui";
import {SimpleTopNavLoginModule} from '@revector/inline-login-form';
import {SignInPanelModule} from '@revector/sign-in-panel';


// Our Components
import {environment} from '../environments/environment';
import {AppComponent} from './app.component'
import {MainContainer} from './main.container'
import {MainComponent} from './main.component'

import { AppRoutingModule}  from './app.routing';


const firebaseConfig = environment.firebaseConfig

const firebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}

let reducers = {
  auth: AuthReducers
}

@NgModule({
  declarations: [
    AppComponent,
    MainContainer,
    MainComponent
  ],
  imports: [
    /* Dev modules */
    AdminUiModule,
    RvAsciidoctorPanelModule,
    AuthModule,
    SimpleTopNavLoginModule,
    SignInPanelModule,
    AppRoutingModule,

    /* Demo Pages / Components */


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

    /* Ng2MD modules */
    MaterialModule.forRoot(),
  ],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor() {
  }
}
