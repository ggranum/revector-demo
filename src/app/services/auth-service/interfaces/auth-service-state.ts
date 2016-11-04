import {ObjMap} from "@revector/shared";


import { User, UsersHavePermissionGrantsRelation, UsersHaveRolesRelation} from "./user";
import { Role, RolesHavePermissionGrantsRelation} from "./role";
import { Permission} from "./permission";
//noinspection TypeScriptPreferShortImport
import {CurrentUserState} from "./current-user-state";



export interface AuthServiceState {
  transient: CurrentUserState
  permissions?: ObjMap<Permission>
  roles?: ObjMap<Role>
  role_permissions?: RolesHavePermissionGrantsRelation
  user_roles?: UsersHaveRolesRelation
  user_permissions?: UsersHavePermissionGrantsRelation
  users?: ObjMap<User>
}


export interface AuthStoreState {
  auth: AuthServiceState
}

