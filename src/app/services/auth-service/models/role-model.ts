import {Role} from '../interfaces'


export class RoleModel implements Role {
  name: string
  description: string

  static from(role: Role): RoleModel {
    let model = new RoleModel()
    Object.assign(model, role)
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
    if (!this.name) {
      result = {
        name: {
          notNull: "Value cannot be null"
        }
      }
    } else if (this.name.length < 4) {
      result = {
        name: {
          minLength: {
            message: "Value too short",
            minLength: 4,
            actual: this.name.length
          }
        }
      }
      return result
    }
  }
}
