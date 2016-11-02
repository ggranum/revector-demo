import {PermissionGrant} from "@revector/auth-service";


export interface UserPermission {
  user_uid: string
  permission_key: string
}

export interface UserRole {
  user_uid: string
  role_key: string
}


export interface UsersHavePermissionGrantsRelation {
  [user_uid: string]: {
    [permission_uid: string]: PermissionGrant
  }
}

export interface UsersHaveRolesRelation {
  [user_uid: string]: {
    [role_uid: string]: boolean
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
