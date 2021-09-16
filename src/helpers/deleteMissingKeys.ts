import { isObject } from './isObject';

export function deleteMissingKeys(target: object, source: object) {
  if (isObject(target) && isObject(source)) {
    for (const key in target) {
      if (!source[key]) delete target[key];
      if (isObject(target[key])) {
        deleteMissingKeys(target[key], source[key]);
      }
    }
  }
}
