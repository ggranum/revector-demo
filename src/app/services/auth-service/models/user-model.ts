import {
  User,
  PermissionMappings
} from '../interfaces'
import {RoleModel} from "./role-model";
import {PermissionModel} from "./permission-model";
import {MappedPermission} from "../interfaces";
import {
  Permission,
} from "@revector/auth-service";
import {ObjMap} from "@revector/shared";

export class UserPermissionMappingModel implements MappedPermission {
  $key: string;
  explicitlyGranted: boolean;
  explicitlyRevoked: boolean;
  roles: {[permKey: string]: boolean};


  static fromRoles(...roles: RoleModel[]): UserPermissionMappingModel {
    let model = new UserPermissionMappingModel()
    roles.forEach((role: RoleModel) => {
      let perms = role.permissions
      Object.keys(perms).forEach((permKey: string) => {
        model.$key = permKey
        model.roles = {}
        model.roles[role.$key] = true
      })
    })
    return model
  }

  static explicit(key: string): UserPermissionMappingModel {
    let model = new UserPermissionMappingModel()
    model.$key = key
    model.explicitlyGranted = true
    return model
  }

  toJson(): MappedPermission {
    return {
      $key: this.$key,
      explicitlyGranted: this.explicitlyGranted,
      explicitlyRevoked: this.explicitlyRevoked,
      roles: this.roles,
    }
  }

}


export class UserModel implements User {
  lastSignInMils: number;
  createdMils: number;
  lastSignInIp: string;
  displayName: string;
  email: string;
  uid: string

  roles: Map<string, RoleModel> = new Map()
  permissions: Map<string, PermissionModel> = new Map()
  revokedPermissions: Map<string, PermissionModel> = new Map()

  static from(user: User): UserModel {
    let model = new UserModel()
    Object.assign(model, user)
    return model
  }


  grantPermission(permission: PermissionModel) {
    this.permissions.set(permission.$key, permission)
  }

  revokePermission(permission: PermissionModel) {
    this.revokedPermissions.set(permission.$key, permission)
  }

  assignRole(role: RoleModel) {
    this.roles.set(role.$key, role)
  }

  getUserRoles():ObjMap<boolean>{
    let userRoles:ObjMap<boolean> = {}
    this.roles.forEach((role:RoleModel)=>{
      userRoles[role.$key] = true
    })
    return userRoles
  }

  getUserPermissions():PermissionMappings{
    let perms: ObjMap<MappedPermission> = {}
    this.roles.forEach((role:RoleModel)=>{
      perms = role.getMappedPermissions(perms, true)
    })

    this.permissions.forEach((perm:Permission)=>{
      let newPerm:MappedPermission = Object.assign({}, perm, perms[perm.$key])
      if(perms[perm.$key]){
        newPerm.explicitlyGranted = true
      } else{
        newPerm = {
          $key: perm.$key,
          explicitlyGranted: true
        }
      }
      perms[perm.$key] = newPerm
    })
    this.revokedPermissions.forEach((perm:Permission)=>{
      let newPerm:MappedPermission = Object.assign({}, perm, perms[perm.$key])
      if(perms[perm.$key]){
        delete newPerm.explicitlyGranted
        newPerm.explicitlyRevoked = true
      } else{
        newPerm = {
          $key: perm.$key,
          explicitlyRevoked: true
        }
      }
      perms[perm.$key] = newPerm
    })
    return perms
  }

  toJson(): User {
    return {
      lastSignInMils: this.lastSignInMils,
      createdMils: this.createdMils,
      lastSignInIp: this.lastSignInIp,
      displayName: this.displayName,
      email: this.email,
      uid: this.uid
    }
  }

  validate() {
    let checks = []
    let result = null

    checks.push(this.checkUid())

    checks.forEach((item) => {
      if (item) {
        if (!result) {
          result = {}
        }
        result = Object.assign(result, item)
      }
    })
    return result
  }

  private checkUid() {
    let result = null
    if (!this.uid) {
      result = {
        uid: {notNull: 'ID cannot be empty'}
      }
    }
    return result
  }
}
