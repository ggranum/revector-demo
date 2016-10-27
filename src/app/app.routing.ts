import {
  NgModule,
} from '@angular/core';
import {
  RouterModule
} from '@angular/router';

import {RoleListContainer} from "@revector/admin-ui";
import {PermissionListContainer} from "@revector/admin-ui";
import {
  SignInPanelDemo,
  SignInPanelPage
} from "@revector/sign-in-panel";
import {AdminPage, UserListItemDemo} from "@revector/admin-ui";
import {MainContainer} from "./main.container";


@NgModule({
  imports: [
    RouterModule.forRoot([
        {path: 'sign-in', component: SignInPanelPage},
        {path: 'admin', component: AdminPage},
        {path: 'permissions', component: PermissionListContainer},
        {path: 'roles', component: RoleListContainer},
        {path: '', component: MainContainer},
        {path: 'demo/sign-in-panel', component: SignInPanelDemo},
        {path: 'demo/user-item', component: UserListItemDemo}
      ])
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
