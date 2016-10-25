import {Permission, Role} from '../interfaces'


export class PermissionModel implements Permission {
  $key:string
  name: string
  description: string

  static from(permission:Permission):PermissionModel{
    let model = new PermissionModel()
    Object.assign(model, permission)
    return model
  }

  validate() {
   return true
  }

}
