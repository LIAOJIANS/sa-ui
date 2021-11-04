import { ref, watch } from 'vue'

export type IUseModelConfig<T = any> = {
  autoEmit?: boolean | undefined,
  autoWatch?: boolean | undefined,
  onChange?: (newVal: T, oldVal: T) => void
}

export default function useModel<T>(
  getter: () => T,
  emitter: ( val: T ) => void,
  config?: IUseModelConfig<T>
) {

  const state = ref(getter()) as { value: T }

  config = config || {}

  if(config.autoWatch !== false) { // 必须不等false  因为默认值为''的时候是通过的
    watch(getter, (val: T) => {
      if(val !== state.value) {
        config!.onChange && config!.onChange(val, state.value)

        state.value = val
      }
    })
  }

  return {
    get value() {
      return state.value
    },

    set value(val: T) {
      state.value = val

      if(config!.autoEmit !== false) {
        emitter(val)
      }
    }
  }
}
