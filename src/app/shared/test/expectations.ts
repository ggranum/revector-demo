
import { ObjMap } from "@revector/shared";
export function expectMapToBeEmpty(map: ObjMap<any>) {
  expect(map).toBeDefined('Should load an empty ObjMap.')
  expect(Object.keys(map).length).toEqual(0, 'Should load an empty ObjMap.')
}

export function expectMapToContainOnly(map: ObjMap<any>, key:string) {
  expect(map[key]).toBeDefined(`Should have added a new value with key ${key}`)
  expect(Object.keys(map).length).toEqual(1, 'Should contain only one value.')
}
