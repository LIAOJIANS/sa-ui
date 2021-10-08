import { reactive, watch } from "vue"

function toNumber(val: number | null | string) {
  if(val == null) {
    return
  }

  if(typeof val === 'string') {
    return Number(val.split('px')[0])
  }

  return val
}

export function useNumber<
  K extends string,
  Props extends { [k: string]: any }
>(
  props: Props,
  keys: K[]
): { numberState: { [k in K]: Exclude<Props[k], string> } } {
  const state = reactive((() => {
    let ret = {} as Record<string, number | undefined> // { [k: string]: number | undefined }

    keys.forEach(k => {
      ret[k] = toNumber(props[k])
    })

    return ret
  })())

  keys.forEach(k => {
    watch(() => props[k], (val: any) => state[k] = toNumber(val))
  })

  return { numberState: state as any }
}