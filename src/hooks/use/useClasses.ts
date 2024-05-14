import { computed } from "vue";
import classname from "../utils/className";

export type SingleClass = null | undefined | string | { [k: string]: boolean | null | undefined }
export type MultipleClass = SingleClass | SingleClass[]

export const useClasses = <T extends () => MultipleClass>(fn: T) => {
  return computed<string>(() => classname(
    fn()
  ))
}