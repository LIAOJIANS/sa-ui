import { VueNode } from "src/advancedComponentionsApi/designComponent.utils"
import { computed, onBeforeUnmount, reactive } from "vue"
import { createPopperServiceComponent } from "../popperService/createPopperServiceComponent"
import { useEdit } from "./useEdit"

export type PlainObject = Record<string, any>

export interface PopperAgent {
  state: { option: PopperServiceComponentOption, },
  isShow: boolean,
  isOpen: boolean,
  show: () => void | Promise<void>,
  hide: () => void | Promise<void>,
  toggle: () => void | Promise<void>,
  destroy: () => void | Promise<void>,
}

interface Attrs {
  [k: string]: ((this: PopperAgent, ...args: any[]) => void) | string | number | null | undefined | PlainObject | boolean | any[]
}

export interface CreateAgentGetterOption {
  name: string,
  render: (attrs: any) => VueNode,
  defaultPopperAttrs?: Attrs | (() => Attrs),
  defaultRenderAttrs?: Attrs | (() => Attrs),
}

export interface SpecificPopperServiceOption {
  reference: PlainObject | (() => PlainObject),
  popperAttrs?: Attrs | (() => Attrs),
  renderAttrs?: Attrs | (() => Attrs),
  hideOnClickBody?: boolean,
}

export type PopperServiceComponentOption = {
  defaultOption: Readonly<CreateAgentGetterOption>,
  serviceOption: SpecificPopperServiceOption,
  getService?: () => ReturnType<typeof createPopperServiceComponent>["use"]["class"]
}

export type EditPopperAgent = ReturnType<typeof useEditPopperAgent>

export function useEditPopperAgent(
  {
    event: { emit },
    serviceGetter: useService,
    option
  }: {
    event: { emit: { onBlur: (e: FocusEvent) => void, onFocus: (e: FocusEvent) => void } },
    serviceGetter: () => ((o: SpecificPopperServiceOption) => PopperAgent),
    option: SpecificPopperServiceOption,
  }
) {
  const service = useService()
  
  const { editComputed } = useEdit()
  // console.log(servic);
  
  const state = reactive({
    agent: null as null | PopperAgent,
    focusCounter: 0
  })

  const isShow = computed(() => !!state.agent && state.agent.isShow)
  const isOpen = computed(() => !!state.agent && state.agent.isOpen)

  const methods = {
    show: async () => {
      if (!editComputed.value.editable) return
      if (isShow.value) return;
      if (!state.agent) {
        
        state.agent = await service(option)
      }
      await state.agent.show()
    },
    hide: async () => {
      if (!isShow.value) return
      await state.agent!.hide()
    },
    toggle: async () => {
      isShow.value ? methods.hide() : methods.show()
    }
  }

  const inputHandler = {
    onClickInput: async () => await methods.toggle(),
    onBlur: async (e: FocusEvent) => {
      state.focusCounter--
      if (state.focusCounter === 0) {
        emit.onBlur(e)
        await methods.hide()
      }
    },
    onFocus: (e: FocusEvent) => {
      if (state.focusCounter === 0) {
        emit.onFocus(e)
      }
      state.focusCounter = 1
    },
    onEsc: async () => {
      await methods.hide()
    },
    onEnter: async (e: KeyboardEvent | KeyboardEvent) => {
      e.stopPropagation()
      e.preventDefault()
      await methods.show()
    }
  }

  onBeforeUnmount(() => {
    if (!!state.agent) {
      state.agent.destroy()
    }
  })


  return {
    methods,
    inputHandler,
    isOpen,
    isShow,
    state,
    editComputed
  }

}