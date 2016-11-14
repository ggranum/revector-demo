import {
  NgModule,
} from '@angular/core';
import {
  RouterModule
} from '@angular/router';

import {RoleListContainer} from "@revector/ui-admin-console";
import {PermissionListContainer} from "@revector/ui-admin-console";
import {
  SignInPanelDemo,
  SignInPanelPage
} from "@revector/sign-in-panel";
import {AdminPage, UserListItemDemo} from "@revector/ui-admin-console";
import {HomeComponent} from "./home.component";


@NgModule({
  imports: [
    RouterModule.forRoot([
        {path: 'sign-in', component: SignInPanelPage},
        {path: 'admin', component: AdminPage},
        {path: 'permissions', component: PermissionListContainer},
        {path: 'roles', component: RoleListContainer},
        {path: '', component: HomeComponent},
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
