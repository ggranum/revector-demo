import {MappedPermission} from "@revector/auth-service";


export class PermissionInstanceModel implements MappedPermission {
  $key:string
  permissionKey:string

  explicitlyGranted?: boolean
  explicitlyRevoked?: boolean

  static from(permission:MappedPermission):PermissionInstanceModel{
    let model = new PermissionInstanceModel()
    Object.assign(model, permission)
    return model
  }

  validate() {
   return true
  }

}
