import { onBeforeUpdate, reactive, SetupContext } from "vue";
import { VueNode } from "./designComponent.utils";

export type SlotProps<SlotKeys extends string, ScopeSlots extends { [k: string]: any }> = {
  [k in Exclude<SlotKeys, keyof ScopeSlots>]?: () => VueNode
}

export function getSlotExist(prevExist: { [k: string]: boolean }, slotNames: string[], ctx: SetupContext) {
  slotNames.forEach((slotName) => {
      const flag = !!ctx.slots[slotName]
      if (prevExist![slotName] !== flag) {
          prevExist![slotName] = flag
      }
  })
  return prevExist
}

export function useSetupSlots(ctx: SetupContext, slots?: string[]) {
  const slotNames = [...(slots || []), 'default']
  const existState = reactive(getSlotExist({}, slotNames, ctx))

  onBeforeUpdate(() => {getSlotExist(existState, slotNames, ctx)})

  return slotNames.reduce((prev, slotName: string) => {
      prev[slotName] = Object.assign((defaultNode: VueNode) => {
          const slot = ctx.slots[slotName]
          return !!slot ? slot() : defaultNode
      }, {
          isExist() {
              return existState[slotName]
          }
      })
      return prev
  }, {} as any)
}
