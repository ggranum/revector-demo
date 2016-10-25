import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AppComponent} from "./app.component";
import {RoleListContainer} from "@revector/admin-ui";
import {PermissionListContainer} from "@revector/admin-ui";
import {SignInPanelDemo} from "@revector/sign-in-panel";
import {UserListItemDemo} from "@revector/admin-ui";

const appRoutes: Routes = [
  { path: 'permissions', component: PermissionListContainer },
  { path: 'roles', component: RoleListContainer },
  { path: 'demo/sign-in-panel', component: SignInPanelDemo },
  { path: 'demo/user-item', component: UserListItemDemo },
  { path: '', component: AppComponent }
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
