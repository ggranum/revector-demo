

/**
 * A permission can be granted directly, as with on a specific user or a specific role.
 * Permissions assigned to Users behave less intuitively, because it is allowable to give a user a role, which
 * automatically grants that user a set of permissions. Once that Role is assigned to the user, the administrator
 * may then REVOKE a permission from that user.
 *
 * It is also possible to explicitly GRANT a permission to a user, and then assign a Role to the same user. We need
 * to capture that the permission should NOT be revoked from the user again if all Roles containing that
 * permission are removed - or, even more esoterically, in the case where all the Roles containing that permission
 * are modified such that said permission is no longer granted to the user via any Role.
 */


export interface Permission {
  $key?: string
  description?: string
  orderIndex?: number
}
