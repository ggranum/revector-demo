// Base Angular2
import {BrowserModule} from '@angular/platform-browser'
import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {AngularFireModule, AuthMethods, AuthProviders} from 'angularfire2'

// Material design
import {MdButtonModule} from '@angular2-material/button/button'
import {MdCheckboxModule} from '@angular2-material/checkbox/checkbox'
import {MdRadioModule} from '@angular2-material/radio/radio'
import {MdSidenavModule} from '@angular2-material/sidenav/sidenav'
import {MdListModule} from '@angular2-material/list/list'
import {MdGridListModule} from '@angular2-material/grid-list/grid-list'
import {MdCardModule} from '@angular2-material/card/card'
import {MdIconModule} from '@angular2-material/icon/icon'
import {MdInputModule} from '@angular2-material/input/input'
import {MdTabsModule} from '@angular2-material/tabs/tabs'
import {MdToolbarModule} from '@angular2-material/toolbar/toolbar'
import {MdTooltipModule} from '@angular2-material/tooltip/tooltip'
import {MdRippleModule} from '@angular2-material/core/ripple/ripple'
import {MdMenuModule} from '@angular2-material/menu/menu'

// NG RX
import {StoreDevtoolsModule} from '@ngrx/store-devtools'
import {StoreLogMonitorModule, useLogMonitor } from '@ngrx/store-log-monitor'
import {StoreModule, combineReducers} from '@ngrx/store'
import {EffectsModule} from '@ngrx/effects';

// Dev modules
import {RvAsciidoctorPanelModule} from './ui/asciidoctor-panel';
import {AuthModule, AuthReducer, RoleReducer} from './services/auth-service'
import {AdminUiModule} from "./ui/admin-ui";
import {SimpleTopNavLoginModule} from './ui/email-password-top-nav-login';


// Our Components
import {environment} from '../environments/environment';
import {AppContainer} from './app.container'
import {AppComponent} from './app.component'
import {AuthEffects, RoleEffects, PermissionEffects} from './services/auth-service/state'
import {PermissionReducer} from './services/auth-service/state/permission/permission.state'

const firebaseConfig = environment.firebaseConfig

const firebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}

let reducers = {
  auth: combineReducers({
    transient: AuthReducer,
    roles: RoleReducer,
    permissions: PermissionReducer
  })
}

@NgModule({
  declarations: [
    AppContainer,
    AppComponent
  ],
  imports: [
    /* Dev modules */
    AdminUiModule,
    RvAsciidoctorPanelModule,
    AuthModule,
    SimpleTopNavLoginModule,

    /* Firebase Modules */
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig),

    /* NgRx */
    StoreModule.provideStore(reducers),
    StoreDevtoolsModule.instrumentStore({monitor: useLogMonitor({visible: true, position: 'left'})}),
    StoreLogMonitorModule,
    EffectsModule.run(AuthEffects),
    EffectsModule.run(RoleEffects),
    EffectsModule.run(PermissionEffects),

    /* Ng2 Modules. */
    BrowserModule,
    CommonModule,

    /* Ng2MD modules */
    MdButtonModule.forRoot(),
    MdCardModule.forRoot(),
    MdCheckboxModule.forRoot(),
    MdGridListModule.forRoot(),
    MdIconModule.forRoot(),
    MdInputModule.forRoot(),
    MdListModule.forRoot(),
    MdMenuModule.forRoot(),
    MdRadioModule.forRoot(),
    MdRippleModule.forRoot(),
    MdSidenavModule.forRoot(),
    MdTabsModule.forRoot(),
    MdToolbarModule.forRoot(),
    MdTooltipModule.forRoot(),
  ],
  providers: [

  ],
  entryComponents: [AppContainer],
  bootstrap: [AppContainer]
})
export class AppModule {

  constructor() {
  }
}
