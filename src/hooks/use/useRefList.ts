import { onBeforeUpdate } from 'vue'


export interface UseRefList {
  <T = Record<string, any>, C = T extends { use: { class: infer R } } ? R :T>(Component?: T): {
    refList: C[],
    onRefList: (index: number) => ((refer: any) => any)
  }
}


export const useRefList: UseRefList = <T>() => {
  const refs = [] as any[]

  onBeforeUpdate(() => refs.length !== 0 && refs.splice(0, refs.length))

  return {
    refList: refs,
    onRefList: index => refer => !!refer && ( refs[index] = refer )
  }
}