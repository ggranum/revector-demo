

import {PermissionGrant} from "./permission-grant"

export interface RolePermission {
  role_key: string
  permission_key: string
}

export interface RolesHavePermissionGrantsRelation {
  [role_key: string]: {
    [permission_key: string]: PermissionGrant
  }
}

/**
 * @todo ggranum: Implement a separation between revoked and granted permissions, so that
 * permission checking can base 'has permission' checks on a simple existence check against the one data structure.
 */
export interface RolePermissions {
  grants: RolesHavePermissionGrantsRelation,
  revocations: RolesHavePermissionGrantsRelation
}


export interface RoleHasPermissionRelation {
  [permission_key: string]: boolean
}


export interface Role {
  $key?: string
  description: string
  orderIndex?: number
}
