import { computed, defineComponent, ref, watch } from "vue"
import { designComponent } from "../advancedComponentionsApi/designComponent"
import './input.scss'


export const SaInput = designComponent({

  props: {
    status: { type: String, default: 'primary' }
  },

  name: 'sa-input',
  setup(props, { emit }) {
    const inputValue = ref('')
    const inputRef = ref(null as any as HTMLInputElement)

    const classes = computed(() => [
      'sa-input',
      `sa-input-status-${ props.status }`
    ])

    const methods = {
      onClickClearIcon(e: MouseEvent) {
        emit('onClickClearIcon', e)
        inputValue.value = ''
      }
    }

    return {

      refer: {
        methods
      },
      render: () => (
        <div class={ classes.value }>
          <input type="text" v-model={ inputValue.value } ref={ inputRef } />
          <button onClick={methods.onClickClearIcon}>清除</button>
        </div>
      )
    }
  }
})


export default SaInput