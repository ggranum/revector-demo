import {RvError, ObjMap} from '../../shared/core-util'
/**
 * Interfaces for the AuthService.
 */

export interface EmailPasswordCredentials {
  email: string,
  password: string
}

export interface Permission {
  uid?: string,
  name: string,
  description?: string
}

export interface Role {
  uid?: string,
  name: string,
  description: string
  // list of permissions from role_permissions
}

export interface UserRoleMapping {
  user_uid: string
  role_uid: string
}

export interface UserRolesMappings {
  [user_uid: string]: {
    [role_uid: string]: boolean
  }
}

export interface RolePermissionsMappings {
  [role_uid: string]: {
    [permission_uid: string]: boolean
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


export interface RoleState extends ObjMap<Role>{}
export interface UserState extends ObjMap<User>{}
export interface PermissionState extends ObjMap<Permission>{}


export interface AuthServiceState {
  transient: AuthServiceSignInState
  permissions?: PermissionState
  roles?: RoleState
  user_roles?: UserRolesMappings
  role_permissions?: RolePermissionsMappings
  users?: UserState
}

export interface AuthServiceStoreState {
  auth: AuthServiceState
}
