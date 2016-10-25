import {
  Role,
  PermissionMappings
} from '../interfaces'
import {
  MappedPermission,
  Permission,
  RolePermissionsMappings
} from "@revector/auth-service";
import {ObjMap} from "@revector/shared";



export class RoleModel implements Role {
  $key: string
  description: string
  orderIndex?: number

  permissions: Map<String, Permission> = new Map()

  static from(role: Role, $key?: string): RoleModel {
    let model = new RoleModel()
    Object.assign(model, role)
    if ($key) {
      model.$key = $key
    }
    return model
  }

  assignPermissions(...permissions: Permission[]) {
    permissions.forEach((permission) => {
      this.permissions.set(permission.$key, permission)
    })
  }

  getMappedPermissions(existingPermissions: ObjMap<MappedPermission>, forUser: boolean = false): ObjMap<MappedPermission> {
    let mappedPerms: ObjMap<MappedPermission> = this.getOwnMappedPermissions(forUser)
    let allPerms:PermissionMappings = Object.assign({}, existingPermissions)

    Object.keys(mappedPerms).forEach((key:string) =>{
      let perm = mappedPerms[key]
      let existingPerm = allPerms[key]
      let newPerm:MappedPermission = Object.assign({}, perm, existingPerm)
      if(existingPerm && existingPerm.roles){
        newPerm.roles = Object.assign({}, perm.roles, existingPerm.roles)
      }
      allPerms[key] = newPerm
    })
    return allPerms
  }

  getOwnMappedPermissions(forUser:boolean = false):PermissionMappings {
    let mappedPerms: PermissionMappings = {}
    this.permissions.forEach((permission: Permission) => {
      let mappedPerm:MappedPermission = { }
      mappedPerm.$key = permission.$key
      mappedPerm.roles = mappedPerm.roles || {}
      if (forUser) {
        mappedPerm.roles[this.$key] = true
      } else{
        mappedPerm.explicitlyGranted = true
      }
      mappedPerms[permission.$key] = mappedPerm
    })
    return mappedPerms;
  }

  toJson():Role{
    return {
      $key: this.$key,
      description:this.description,
      orderIndex: this.orderIndex
    }
  }

  validate() {
    return true
  }
}
