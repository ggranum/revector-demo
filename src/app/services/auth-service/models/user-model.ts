import {User} from '../interfaces'


export class UserModel implements User {
  lastSignInMils: number;
  createdMils: number;
  lastSignInIp: string;
  displayName: string;
  email: string;
  uid: string
  name: string
  description: string

  static from(user: User): UserModel {
    let model = new UserModel()
    Object.assign(model, user)
    return model
  }


  validate() {
    let checks = []
    let result = null

    checks.push(this.checkUid())
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

  private checkUid() {
    let result = null
    if (!this.uid) {
      result = {
        uid: {notNull: "ID cannot be empty"}
      }
    }
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
