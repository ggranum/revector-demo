export interface RvError {
  code: string, message: string, args?: any[]
}

export interface ObjMap<T> {
  [key: string]: T
}

export const cleanFirebaseMap = function<T>(firebaseList: ObjMap<T>, deep?: boolean): ObjMap<T> {
  let result: ObjMap<T> = {}

  Object.keys(firebaseList).forEach((key: string) => {
    if (key[0] !== '$') {
      if (deep && firebaseList[key] instanceof Object) {
        result[key] = <any>cleanFirebaseMap(<any>firebaseList[key], true)
      } else {
        result[key] = firebaseList[key]
      }
    }
  })
  return result
}
export const pathExists = (object: any, path: string): any => {
  let parts = path.split('\.')
  let exists = true
  let obj = object
  for (let i = 0; i < parts.length; i++) {
    obj = obj[parts[i]]
    if (obj === undefined) {
      exists = false
      break
    }
  }
  return exists
}

export const ensureExists = (object: any, path: string, value: any = true): any => {
  let parts = path.split('\.')
  let obj = object
  for (let i = 0; i < parts.length - 1; i++) {
    let key = parts[i]
    if (obj[key] === undefined) {
      obj[key] = {}
    }
    obj = obj[key]
  }
  let lastKey = parts[parts.length - 1]
  if (obj[lastKey] === undefined) {
    obj[lastKey] = value
  }
  return obj[lastKey]
}

export const removeIfExists = (object: any, path: string): boolean => {
  let parts = path.split('\.')
  let obj = object
  let existed = true
  for (let i = 0; i < parts.length - 1; i++) {
    obj = obj[parts[i]]
    if (obj === undefined) {
      existed = false
      break
    }
  }
  if (existed) {
    let lastKey = parts[parts.length - 1]
    existed = obj[lastKey] !== undefined
    if (existed) {
      delete obj[lastKey]
    }
  }
  return existed
}

export const safe = (fn: ()=>any) => {
  try {
    return fn()
  } catch (e) {
    return null
  }
}
