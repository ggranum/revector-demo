import {RvError, ObjMap} from '../../shared/core-util'
/**
 * Interfaces for the AuthService.
 */



export interface EmailPasswordCredentials {
  email: string,
  password: string
}


export interface Permission {
  name: string,
  description?: string
}


export interface Role {
  uid?: string,
  name: string,
  description: string
  // list of permissions from role_permissions
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

export interface UserInfo {
  uid: string
  lastSignInMils: number
  createdMils: number
  lastSignInIp: string
  displayName: string
  email: string
  photoURL?: string,
  emailVerified?: boolean
  disabled?: boolean,
  isAnonymous?: boolean,
}

export interface User {
  info: UserInfo
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
  currentUser?: UserInfo
}


export interface AuthServiceState {
  transient: AuthServiceSignInState
  permissions?: ObjMap<Permission>
  roles?: ObjMap<Role>
  user_roles?: UserRolesMappings
  role_permissions?: RolePermissionsMappings
  users?: ObjMap<User>
}

export interface AuthServiceStoreData {
  auth: AuthServiceState
}

// Not used, exists as mental aid.
interface MockAuthServiceData {
  transient: {
    signInState?: SignInState
    currentUser?: {
      lastSignInMils: number
      createdMils: number
      lastSignInIp: string
      displayName: string
      email: string
      emailVerified: boolean
      disabled: boolean
    }
  }
  permissions?: {
    [permission_uid: string]: {
      name: string,
      description?: string
    }
  }
  roles?: {
    [role_uid: string]: {
      name: string,
      description: string
      // list of permissions from role_permissions
    }
  }
  user_roles?: {
    [user_uid: string]: {
      [role_uid: string]: boolean
    }
  }
  role_permissions?: {
    [role_uid: string]: {
      [permission_uid: string]: boolean
    }
  }
  users?: {
    [user_uid: string]: {
      info: {
        lastSignInMils: number
        createdMils: number
        lastSignInIp: string
        displayName: string
        email: string
        emailVerified: boolean
        disabled: boolean
      }
    }
  }
}
