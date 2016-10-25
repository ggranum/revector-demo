import {NgModule} from '@angular/core'


import {CommonModule} from '@angular/common'
import {FormsModule} from '@angular/forms'

import {MdButtonModule} from '@angular/material/button/button'
import {MdIconModule} from '@angular/material/icon/icon'
import {MdInputModule} from '@angular/material/input/input'


import {TopNavLoginContainer} from './top-nav-login.container'
import {TopNavLoginComponent} from './top-nav-login.component'
import {TopNavProfileComponent} from './top-nav-profile.component'

@NgModule({
  declarations: [
    TopNavLoginContainer,
    TopNavLoginComponent,
    TopNavProfileComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MdButtonModule,

    MdIconModule,
    MdInputModule
  ],
  exports: [
    TopNavLoginContainer
  ]
})
export class SimpleTopNavLoginModule {

}
