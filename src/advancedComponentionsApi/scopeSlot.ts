import { onBeforeUpdate, reactive, SetupContext } from "vue";
import { VueNode } from "./designComponent.utils";
import { getSlotExist } from "./sort";

export type ScopeSlotProps<SlotKeys extends string, ScopeSlots extends { [k: string]: (scope: any) => any }> = {
  [k in Exclude<keyof ScopeSlots, SlotKeys>]?: (scope: Parameters<ScopeSlots[k]>[0]) => VueNode
}

export interface iScopeSlotsOption {
  [k: string]: (scope: any) => void
}

export function useSetupScopeSlots(ctx: SetupContext, scopeSlotsOptions?: iScopeSlotsOption) {

  const slotNames = Object.keys(scopeSlotsOptions||{})
  const existState = reactive(getSlotExist({}, slotNames, ctx))
  onBeforeUpdate(() => {getSlotExist(existState, slotNames, ctx)})

  return slotNames.reduce((prev: any, slotName: string) => {
      prev[slotName] = Object.assign((scope: any, vnode: VueNode) => {
          const slot = ctx.slots[slotName]
          return !!slot ? slot(scope) : vnode
      }, {
          isExist() {
              return existState[slotName]
          },
      })
      return prev
  }, {} as any)
}
