import {Permission} from '../interfaces'


export class PermissionModel implements Permission {
  name: string
  description: string

  static from(permission: Permission): PermissionModel {
    let model = new PermissionModel()
    Object.assign(model, permission)
    return model
  }


  validate() {
    let checks = []
    let result = null

    checks.push(this.checkName())

    checks.forEach((item) => {
      if(item){
        if(!result){
          result = {}
        }
        result = Object.assign(result, item)
      }
    })
    return result
  }

  private checkName() {
    let result = null
    if (!name) {
      result = {
        name: {
          notNull: "Value cannot be null"
        }
      }
    } else if (name.length < 4) {
      result = {
        name: {
          minLength: {
            message: "Value too short",
            minLength: 4,
            actual: name.length
          }
        }
      }
      return result
    }
  }
}
