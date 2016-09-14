import {NgModule} from '@angular/core'

import {CommonModule} from '@angular/common'
import {FormsModule} from '@angular/forms'

import {RoleListContainer} from './roles/list/role-list.container'
import {RoleListComponent} from './roles/list/role-list.component'
import {RoleComponent} from './roles/role/role.component'
import {RoleContainer} from './roles/role/role.container'

import {PermissionListContainer} from './permissions/list/permission-list.container'
import {PermissionListComponent} from './permissions/list/permission-list.component'
import {PermissionComponent} from './permissions/permission/permission.component'

import {UserListContainer} from './users/list/user-list.container'
import {UserListComponent} from './users/list/user-list.component'

import {UserContainer} from './users/user/user.container'
import {UserComponent} from './users/user/user.component'

import {MdButtonModule} from '@angular2-material/button/button'
import {MdIconModule} from '@angular2-material/icon/icon'
import {MdInputModule} from '@angular2-material/input/input'
import {MdToolbarModule} from '@angular2-material/toolbar/toolbar'
import {MdMenuModule} from '@angular2-material/menu'
import {MdListModule} from '@angular2-material/list/list'
import {MdCheckboxModule} from '@angular2-material/checkbox/checkbox'


@NgModule({
  declarations: [
    UserListContainer,
    UserListComponent,
    UserComponent,
    UserContainer,
    RoleListContainer,
    RoleListComponent,
    RoleComponent,
    RoleContainer,
    PermissionListContainer,
    PermissionListComponent,
    PermissionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MdButtonModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdToolbarModule,
    MdCheckboxModule,
  ],
  exports: [
    UserContainer,
    UserListContainer,
    RoleListContainer,
    PermissionListContainer,
  ]
})
export class AdminUiModule {

}
