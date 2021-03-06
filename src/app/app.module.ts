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
import {AdminUiModule} from "@revector/ui-admin-console";
import {SignInPanelModule} from '@revector/sign-in-panel';


// Our Components
import {environment} from '../environments/environment';
import {AppComponent} from './app.component'
import {MainContainer} from './main.container'
import {MainComponent} from './main.component'
import {HomeComponent} from './home.component'

import { AppRoutingModule}  from './app.routing';


const firebaseConfig = environment.firebaseConfig

const firebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}

let reducers = {
  auth: AuthReducers
}

// for unit tests; can't initialize firebase twice.
let firebaseApp = null
try {
  firebaseApp = window['firebaseApp'] || AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig)
  window['firebaseApp'] = firebaseApp
} catch (e) {
  console.log('error!', e)
}

@NgModule({
  declarations: [
    AppComponent,
    MainContainer,
    MainComponent,
    HomeComponent
  ],
  imports: [
    /* Dev modules */
    AdminUiModule,
    RvAsciidoctorPanelModule,
    AuthModule,
    SignInPanelModule,
    AppRoutingModule,

    /* Demo Pages / Components */


    /* Firebase Modules */
    firebaseApp,

    /* NgRx */
    StoreModule.provideStore(reducers),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
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
