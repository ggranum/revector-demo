
export interface RvError {
  code: string, message: string, args?: any[]
}

export interface ObjMap<T> {
  [key:string]: T
}

export const cleanFirebaseMap = function<T>(firebaseList: ObjMap<T>): ObjMap<T> {
  let result: ObjMap<T> = {}

  Object.keys(firebaseList).forEach((key: string) => {
    if (key[0] != '$') {
      result[key] = firebaseList[key]
    }
  })

  return result
}
