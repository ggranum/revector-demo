import {NgModule} from '@angular/core'

import {CommonModule} from '@angular/common'
import {FormsModule} from '@angular/forms'

//noinspection TypeScriptPreferShortImport
import {RoleListContainer} from './roles/list/role-list.container'
import {RoleListComponent} from './roles/list/role-list.component'
import {RoleComponent} from './roles/role/role.component'
import {RoleContainer} from './roles/role/role.container'

//noinspection TypeScriptPreferShortImport
import {PermissionListContainer} from './permissions/list/permission-list.container'
import {PermissionListComponent} from './permissions/list/permission-list.component'
import {PermissionComponent} from './permissions/permission/permission.component'

import {UserListContainer} from './users/list/user-list.container'
import {UserListComponent} from './users/list/user-list.component'

//noinspection TypeScriptPreferShortImport
import {UserListItemDemo} from './users/user/user-list-item.demo'
import {UserListItemContainer} from "./users/user/user-list-item.container";
import {UserListItemComponent} from "./users/user/user-list-item.component";
import {RoleAvatarComponent} from "./users/user/role-avatar.component";
import {UserPermissionEditorComponent} from "./users/user/user-permission-editor.component";

import {MdButtonModule} from '@angular/material/button'
import {MdButtonToggleModule} from '@angular/material/button-toggle'
import {MdIconModule} from '@angular/material/icon'
import {MdInputModule} from '@angular/material/input'
import {MdToolbarModule} from '@angular/material/toolbar'
import {MdMenuModule} from '@angular/material/menu'
import {MdListModule} from '@angular/material/list'
import {MdCheckboxModule} from '@angular/material/checkbox'
import {MdTabsModule} from '@angular/material/tabs'

import {DrawerModule} from "@revector/drawer";
import {AdminPage} from "./admin.page";

@NgModule({
  declarations: [
    AdminPage,
    UserListContainer,
    UserListComponent,
    UserListItemComponent,
    RoleAvatarComponent,
    UserPermissionEditorComponent,
    UserListItemDemo,
    UserListItemContainer,
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
    MdButtonToggleModule,
    MdTabsModule,
    DrawerModule
  ],
  exports: [
    AdminPage,
    UserListItemContainer,
    UserListContainer,
    RoleListContainer,
    PermissionListContainer,
  ]
})
export class AdminUiModule {

}
