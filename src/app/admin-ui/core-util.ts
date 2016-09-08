export const cleanFirebaseMap = function<T>(firebaseList: Map<string, T>): Map<string, T> {
  let result: Map<string, T> = <Map<string, T>>{}

  Object.keys(firebaseList).forEach((key: string) => {
    if (key[0] != '$') {
      result[key] = firebaseList[key]
    }
  })

  return result
}
