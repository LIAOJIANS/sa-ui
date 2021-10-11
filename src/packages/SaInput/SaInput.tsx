import { computed, PropType, ref } from "vue"
import { designComponent } from "../../advancedComponentionsApi/designComponent"
import './input.scss'
import {
  classname,
  unit,

  StyleProps,

  useStyle,
  useStyles,
  useNumber,
  useModel,
  useRefs,
  useEdit
} from '../../hooks'
import { handleError } from "vue"


export const SaInput = designComponent({
  name: 'sa-input',
  props: {
    ...StyleProps,
    textarea: { type: Boolean },
    block: { type: Boolean },
    clearIcon: {type: Boolean},

    width: { type: [Number, String] as PropType<string | number>, default: null },
    minHeight: { type: [Number, String], default: 100 },
    maxHeight: { type: [Number, String] as PropType<string | number | null>, default: 156 },
    autoHeight: { type: Boolean },

    modelValue: { type: [String, Number] as PropType<string | number | null>},
    clearHandler: Function,

    readonly: { type: Boolean }
  },

  emits: {
    onUpdateModelValue: (val: any) => true,
    onFocus: (e: FocusEvent) => true,
    onBlur: (e: FocusEvent) => true,
    onKeydown: (e: KeyboardEvent) => true,
    onEnter: (e: KeyboardEvent) => true,
    onEsc: (e: KeyboardEvent) => true,

    onClickInput: (e: MouseEvent) => true,
    onClickPrefixIcon: (e: MouseEvent) => true,
    onClickSuffixIcon: (e: MouseEvent) => true,
    onClickClearIcon: (e: MouseEvent) => true,
  },

  setup({ props, event: { emit } }) {
    // const inputValue = ref('')
    // const inputRef = ref(null as any as HTMLInputElement)

    const { onRef } = useRefs({
      input: HTMLInputElement,
      hiddenInput: HTMLTextAreaElement,
    })

    const model = useModel(() => props.modelValue, emit.onUpdateModelValue)
    const { styleComputed } = useStyle({ status: undefined })
    const { editState, editComputed } = useEdit()
    const { numberState } = useNumber(props, ['width', 'minHeight', 'minHeight'])

    const styles = useStyles(styles => {
      if (!numberState.width && !props.block) {
        styles.width = unit(numberState.width)
      }

      // if(!!props.textarea) {
      //   if(!props.autoHeight) {
      //     styles.height = unit('100')
      //   } else {

      //   }
      // }

      return styles
    })

    
    const classes = computed(() => classname([
      `sa-input-shape-${styleComputed.value.shape}`,
      `sa-input-size-${styleComputed.value.size}`,
      {
        [`sa-input-status-${styleComputed.value.status}`]: !!styleComputed.value.status,
      }
    ]))




    const methods = {
      clearValue: () => {
        model.value = undefined
      }
    }

    const hander = {
      clickClearIcon: (e: MouseEvent) => {
        if(!editComputed.value.editable) {
          return
        }

        e.stopPropagation()
        e.preventDefault()
        emit.onClickClearIcon(e)
        props.clearHandler ? props.clearHandler() : methods.clearValue()
      },

      input: (e: any) => {
        model.value = e.target.value
      }
    }

    
    const publicProps = computed(() => ({
      style: styles.value,
      disabled: editComputed.value.disabled,
      readonly: props.readonly || editComputed.value.readonly || editComputed.value.loading,
      value: model.value || '',

      onInput: hander.input,
      onClick: emit.onClickInput,
      onFocus: (e: FocusEvent) => {
        if (e.target !== e.currentTarget) {
          return
        }
        emit.onFocus
      },
      onBlur: (e: FocusEvent) => {
        if (e.target !== e.currentTarget) { return }
        emit.onBlur(e)
      },
      ref: onRef.input,
    }) as any)


    

    return {

      refer: {
        methods
      },
      render: () => {

        if (props.textarea) {

          return (
            <div class={'sa-textarea ' + classes.value}>
              <textarea class='sa-textarea-inner' {...publicProps.value}></textarea>
            </div>
          )

        } else {
          return (
            <div class={'sa-input ' + classes.value}>
              <input class="sa-input-inner" {...publicProps.value} />
              { props.clearIcon && <button onClick={ hander.clickClearIcon }>清空</button> }
            </div>
          )
        }
      }
    }
  }
})


export default SaInput