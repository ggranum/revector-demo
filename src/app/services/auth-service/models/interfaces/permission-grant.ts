/**
 *
 * Defines a permission that can be:
 *  - [*] Manually/explicitly assigned
 *  - [*] Assigned via the assignment of a Role
 *  - [*] Manually/explicitly Revoked, even if it is assigned as part of a Role
 *
 *
 * This data structure also retains the general awareness of the original assignment structure, sufficient to allow the
 * reconstruction of a user's permissions from their assigned Roles.
 *
 * let somePermission = {
 *    ADD_ROLE,
 *    explicitlyGranted: true,
 *    explicitlyRevoked: false,
 *    roles: {
 *      ADMINISTRATOR: true,
 *      USER: true
 *    },
 *  }
 *
 */
export interface PermissionGrant {
  $key?: string
  explicitlyGranted?: boolean,
  explicitlyRevoked?: boolean,
  roles?: {
    [role_key: string]: boolean
  }
}



