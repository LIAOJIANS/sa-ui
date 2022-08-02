import { SimpleFunction } from "src/advancedComponentionsApi/emit";
import { delay, ModelType, useRefs, useStyle } from "src/hooks";
import { EditPopperAgent } from "src/hooks/use/useEditPopperAgent";
import { handleKeyboard } from "src/keyboard";
import { computed } from "vue";
import SaInput from "../SaInput/SaInput";
import { SaDateTimeInput } from "./SaDateTimeInput";

export function useDateTime(
  {
    value,
    start,
    end,
    props,
    agentState,
    emit
  }: {
    value: ModelType,
    start: ModelType,
    end: ModelType,
    props: {
      range?: boolean
    },
    agentState: EditPopperAgent,
    emit: {
      onBlur: SimpleFunction
    },
  }
) {
  useStyle()

  const { refs, onRef } = useRefs({
    valueInput: SaDateTimeInput,
    startInput: SaDateTimeInput,
    endInput: SaDateTimeInput,
    saInput: SaInput
  })

  const inputValue = computed(() => !props.range ? value.value : ((start.value || '') + (end.value || '')))

  const handler = {
    clearHandler: () => {
      if (!props.range) {
        value.value = null
      } else {
        start.value = null
        end.value = null
      }
    },

    clickInput: () => {
      !props.range ? agentState.methods.toggle() : agentState.methods.show()
    },

    customInputFocus: (e: FocusEvent) => {
      agentState.inputHandler.onFocus(e)
    },

    async customInputBlur(e: FocusEvent) {
      if (!props.range) {
        agentState.inputHandler.onBlur(e)
      } else {
        await delay(0)
        if ([
          refs.startInput!.refs.input,
          refs.endInput!.refs.input,
        ].indexOf(document.activeElement as any) === -1) {
          agentState.state.focusCounter--
          if (agentState.state.focusCounter === 0) {
            emit.onBlur()
            agentState.methods.hide()
          }
        }
      }
    },

    keydown: handleKeyboard({
      enter: agentState.inputHandler.onEnter,
      esc: agentState.inputHandler.onEsc,
    })
  }

  return {
    refs,
    inputValue,
    handler,
    onRef,
  }
}