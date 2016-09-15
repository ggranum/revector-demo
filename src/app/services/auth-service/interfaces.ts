import {RvError, ObjMap} from '../../shared/core-util'
/**
 * Interfaces for the AuthService.
 */

export interface EmailPasswordCredentials {
  email: string,
  password: string
}

export interface Permission {
  $key?: string
  description?: string
  orderIndex?: number
}

export interface Role {
  $key?: string
  description: string
  orderIndex?: number
}

export interface UserRole {
  user_uid: string
  role_name: string
}

export interface UserRolesMappings {
  [user_uid: string]: {
    [role_uid: string]: boolean
  }
}

export interface UserPermission {
  user_uid: string
  permission_name: string
}

export interface RolePermission {
  role_name: string
  permission_name: string
}

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
export interface MappedPermission {
  $key?: string
  explicitlyGranted?: boolean,
  explicitlyRevoked?: boolean,
  roles?: {
    [role_key: string]: boolean
  }
}


export interface RolePermissionsMappings {
  [role_uid: string]: {
    [permission_uid: string]: MappedPermission
  }
}

/**
 * @todo ggranum: Implement a separation between revoked and granted permissions, so that
 * permission checking can base 'has permission' checks on a simple existence check against the one data structure.
 */
export interface RolePermissions {
  grants: RolePermissionsMappings,
  revocations: RolePermissionsMappings
}

export interface UserPermissionsMappings {
  [user_uid: string]: {
    [permission_uid: string]: MappedPermission
  }
}

export interface User {
  uid?: string
  lastSignInMils?: number
  createdMils: number
  lastSignInIp?: string
  displayName?: string
  email?: string
  photoURL?: string,
  emailVerified?: boolean
  disabled?: boolean,
  isAnonymous?: boolean,
}

/**
 * Transient 'per session', for flow state management and/or convenience.
 */

export enum SignInStates {
  unknown = 1,
  signedOut = 10,
  signingIn = 20,
  signedIn = 30,
  signInFailed = 40,
  signingOut = 50,
  signingUp = 60,
  newAccount = 70,
  signUpFailed = 80,
}

export interface SignInState {
  state: SignInStates,
  error?: RvError
}

export interface AuthServiceSignInState {
  signInState?: SignInState
  currentUser?: User
}


export interface RoleState extends ObjMap<Role> {
}
export interface UserState extends ObjMap<User> {
}
export interface PermissionState extends ObjMap<Permission> {
}


export interface AuthServiceState {
  transient: AuthServiceSignInState
  permissions?: PermissionState
  roles?: RoleState
  user_roles?: UserRolesMappings
  role_permissions?: RolePermissionsMappings
  user_permissions?: RolePermissionsMappings
  users?: UserState
}

export interface AuthServiceStoreState {
  auth: AuthServiceState
}
