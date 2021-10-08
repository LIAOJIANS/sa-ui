import { getCurrentInstance } from 'vue'


export default function useFunctionWrapper<P extends any[], T extends (ctx: any, ...args: P) => any>(
  key: string, 
  func: T
  ): (...args: P) => ReturnType<T> {
    return (...args: P) => {
      const ctx = getCurrentInstance() as any

      if(!ctx._use) {
        ctx._use = {}
      }

      if(!!ctx._use[key]) {
        throw new Error(`use ${key} can only be executed once!`)
      }

      return (ctx._use[key] = func(ctx, ...args))
    }
  }