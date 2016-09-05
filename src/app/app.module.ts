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
import {instrumentStore} from '@ngrx/store-devtools'
import {StoreLogMonitorComponent, useLogMonitor} from '@ngrx/store-log-monitor'
import {StoreModule, combineReducers} from '@ngrx/store'


// Our Modules
import {AuthModule, AuthReducer} from '@revector/auth-service'
import {SimpleTopNavLoginModule} from "@revector/email-password-top-nav-login";
import {RvAsciidoctorPanelModule} from "@revector/asciidoctor-panel";


// Our Components
import { environment } from '../environments/environment';
import {AppContainer} from './app.container'
import {AppComponent} from './app.component'

const firebaseConfig = environment.firebaseConfig

const firebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}

@NgModule({
  declarations: [
    AppContainer,
    AppComponent,
    StoreLogMonitorComponent,
  ],
  imports: [
    RvAsciidoctorPanelModule,
    AuthModule,
    SimpleTopNavLoginModule,
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig),
    StoreModule.provideStore({ auth: AuthReducer, }),
    BrowserModule,
    CommonModule,
    MdButtonModule,
    MdCardModule,
    MdCheckboxModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdRadioModule,
    MdRippleModule,
    MdSidenavModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule,
  ],
  providers: [
    instrumentStore({ monitor: useLogMonitor({ visible: true, position: 'left' }) })
  ],
  entryComponents: [AppContainer],
  bootstrap: [AppContainer]
})
export class AppModule {

  constructor() {
  }
}
