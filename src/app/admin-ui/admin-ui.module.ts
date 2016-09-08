import {NgModule} from '@angular/core'

import {CommonModule} from '@angular/common'
import {FormsModule} from '@angular/forms'



import {UserListContainer} from './users/user-list.container'
import {UserListComponent} from './users/user-list.component'
import {UserComponent} from './users/user.component'

import {RoleListContainer} from './roles/role-list.container'
import {RoleListComponent} from './roles/role-list.component'

import {MdButtonModule} from '@angular2-material/button/button'
import {MdIconModule} from '@angular2-material/icon/icon'
import {MdInputModule} from '@angular2-material/input/input'
import {MdToolbarModule} from '@angular2-material/toolbar/toolbar'
import {MdMenuModule} from '@angular2-material/menu';

@NgModule({
  declarations: [
    UserListContainer,
    UserListComponent,
    UserComponent,
    RoleListContainer,
    RoleListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MdButtonModule,
    MdIconModule,
    MdInputModule,
    MdToolbarModule,
    MdMenuModule
  ],
  exports: [
    UserListContainer,
    RoleListContainer
  ]
})
export class AdminUiModule {

}
