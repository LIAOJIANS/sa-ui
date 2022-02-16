import { designComponent } from "src/advancedComponentionsApi/designComponent"
import { classname, EditProps, StyleProps, useModel, useRefs, useEditPopperAgent, useCollect, useStyle } from "src/hooks"
import { computed, ref, Fragment, watch } from "vue"

import './SaSelect.scss'
import { SaInputInnertags } from "../SaInput/SaInputInnertags"
import { SaInput } from "../SaInput/SaInput"
import { useSelect } from "./useSelect"
import { SaSelectPanel } from "./SaSelectPanel"
import { PropType } from "vue"
import { SaSelectOption, SelectOption } from "../SaSelectOption/SaSelectOption"
import SaPopper from "../SaPopper/SaPopper"
import SaIcon from '../SaIcon/SaIcon'
import { handleKeyboard } from "src/keyboard"

const Props = {
  ...EditProps,
  ...StyleProps,

  modelValue: { type: [Array, String, Number] },                // 双绑
  inputProps: { type: Object as PropType<Partial<typeof SaInput.use.props>> },   // input组件绑定属性对象

  multiple: { type: Boolean },                                  // 是否开启多选
  maxMutipleLimit: { type: Number },                            // 最多选择个数
  minMutipleLimit: { type: Number },                            // 最少选择个数
  filterable: { type: Boolean, default: true },                                // 是否开启筛选过滤
  filterMethod: Function,                                       // 过滤函数

  maxTags: { type: Number },                                    // 显示tag的个数
  collapseTags: { type: Boolean, default: true },
  placeholder: { type: [String, Number], default: '' },         // placeholder 提示

  popperAttrs: { type: Object as PropType<Partial<typeof SaPopper.use.props>> },

}

export const SaSelect = designComponent({

  props: {
    ...Props
  },

  name: 'sa-select',
  emits: {
    onUpdateModelValue: (val?: number | string | string[]) => true,
    onClick: (option: SelectOption) => true,

    onSpace: (e: KeyboardEvent) => true,
    onEnter: (e: KeyboardEvent) => true,
    onUp: (e: KeyboardEvent) => true,
    onDown: (e: KeyboardEvent) => true,
    onEsc: (e: KeyboardEvent) => true,

    onBlur: (e: FocusEvent) => true,
    onFocus: (e: FocusEvent) => true,
  },

  slots: ['default'],
  setup({ props, event, slots }) {

    useStyle()
    const { emit } = event
    const { onRef, refs } = useRefs({ input: SaInput })

    let panel = null as typeof SaSelectPanel.use.class | null

    const model = useModel(() => props.modelValue as number | string | string[] | undefined, emit.onUpdateModelValue)

    const filterText = ref(null as string | null)

    const agentState = useEditPopperAgent({
      event,
      serviceGetter: useSelect,
      option: {
        reference: () => refs.input?.refs.input,
        renderAttrs: () => ({
          ref: r => panel = r,
          ...(() => {
            {
              const { loading, readonly, customReadonly, collapseTags, maxTags, inputProps, filterable, ...leftProps } = Props
              return Object.keys(leftProps).reduce((ret: any, key) => {
                ret[key] = (props as any)[key]
                return ret
              }, {})
            }
          })(),

          modelValue: model.value,
          height: popperHeight.value,
          content: slots.default,
          filterMethod: utils.filterMethod,
          onChange: handler.onServiceChange,
          onClick: event.emit.onClick,
        }),

        popperAttrs: ({
          ...props.popperAttrs,
          onMousedownPopper: () => agentState.state.focusCounter++,
          onClickPopper: () => refs.input!.methods.focus(),
          onHide: () => filterText.value = null
        })
      }

    })

    const items = SelectCollector.parent() // 收集option

    const formatData = computed(() => items.filter(i => !i.props.group))

    const popperHeight = computed(() => formatData.value.length > 6 ? 200 : null) // popper 高度

    const displayValue = computed(() => {
      if (!props.multiple) {
        for (let i = 0; i < formatData.value.length; i++) {
          const item = formatData.value[i] as any

          if (item.props.val == model.value) {
            return item.props.label
          }
        }
        return model.value as string
      } else {
        let strings: string[] = []
        if (!!model.value && Array.isArray(model.value)) {
          for (let i = 0; i < formatData.value.length; i++) {
            const item = formatData.value[i];
            if (model.value.indexOf(item.props.val! as string) > -1) {
              strings.push(item.props.label! as string)
            }
          }
        }
        return strings.join('').trim()
      }
    })

    const multipleTags = computed(() => {
      if (!model.value) {
        return []
      }
      if (!Array.isArray(model.value)) {
        console.error('The value of multiple select should be array')
        return []
      }
      if (!formatData.value || formatData.value.length === 0) return []
      return formatData.value.filter(option => (model.value as any[]).indexOf(option.props.val!) > -1)
    })

    const utils = {
      filterMethod: (option: { label?: string, val: string, disabled: boolean }) => {
        if (!!props.filterMethod) return props.filterMethod(filterText.value, option)
        return !!filterText.value && !!filterText.value.trim() ? (!!option.label && option.label.indexOf(filterText.value) > -1) : true
      }
    }

    const handler = {
      onServiceChange: (val: any) => model.value = val,

      onClickItemCloseIcon: (item: SelectOption, index: number) => {

        index = (model.value as any[]).indexOf(item.props.val!)
        if (index > -1) {
          const value = [...(model.value as any[])]
          value.splice(index, 1)
          model.value = [...value]
        }
      },

      onInputClear: () => model.value = undefined,

      onInputChange: (val: string | null) => {
        filterText.value = val

        if (agentState.isShow.value) {
          agentState.methods.show()
        }
      },

      onInputKeydown: handleKeyboard({
        space: (e) => {
          if (props.multiple && agentState.isShow.value) {
            e.stopPropagation()
            e.preventDefault()
            panel!.methods.selectHighlight()
          }
          event.emit.onSpace(e)
        },
        enter: (e) => {
          e.stopPropagation()
          e.preventDefault()
          if (agentState.isShow.value) {
            panel!.methods.selectHighlight()
          } else {
            agentState.methods.show()
          }
        },
        up: (e) => {
          e.stopPropagation()
          e.preventDefault()
          if (!!agentState.isShow.value) {
            panel!.methods.highlightPrev()
          }
        },
        down: (e) => {
          e.stopPropagation()
          e.preventDefault()
          if (!!agentState.isShow.value) {
            panel!.methods.highlightNext()
          }
        },
        esc: (e) => {
          e.stopPropagation()
          e.preventDefault()
          if (!!agentState.isShow.value) {
            agentState.methods.hide()
          }
        },
      }),
    }

    const inputProps = computed(() => Object.assign({}, props.inputProps || {})) // 拷贝一份input属性
    const placeholderValue = computed(() => {
      if (agentState.isShow.value) {
        return displayValue.value
      }
      if (!!inputProps.value.placeholder) {
        return inputProps.value.placeholder
      }
      return agentState.editComputed.value.placeholder
    })

    const inputBinding = computed(() => {

      const { onEnter, ...inputHandler } = agentState.inputHandler
      return {
        ref: onRef.input,
        class: classname([
          'sa-select',
          {
            'sa-input-tags': !!props.multiple,
            'sa-select-input-show': agentState.isShow.value,
          }
        ]),

        modelValue: (props.filterable && agentState.isShow.value) ? filterText.value! : displayValue.value as string,
        placeValue: displayValue.value as string,
        readonly: !props.filterable,
        placeholder: placeholderValue.value as string,
        suffixIcon: 'el-icon-arrow-down',
        clearIcon: true,
        isFocus: agentState.state.focusCounter > 0,
        clearHandler: handler.onInputClear,

        ...inputHandler,
        onChange: handler.onInputChange,
        onKeydown: handler.onInputKeydown,

        ...inputProps.value,
      }
    })

    return {
      render: () => {
        return <SaInput {...inputBinding.value}>
          {{
            hidden: () => slots.default(),
            default: !props.multiple ? null : () => (
              // <d></d>
              <SaInputInnertags
                data={multipleTags.value}
                collapseTags={props.collapseTags}
                maxTags={props.maxTags}
                placeholder={inputBinding.value.placeholder!}
                v-slots={{
                  default: ({ item, index }: { item: SelectOption, index: number }) => (
                    <Fragment key={index}>
                      <span>{item.props.label}</span>
                      <SaIcon icon="el-icon-close" onClick={handler.onClickItemCloseIcon(item, index)} />
                    </Fragment>
                  )
                }}
              />
            )
          }}
        </SaInput>
      }
    }
  }
})

export const SelectCollector = useCollect(() => ({
  parent: SaSelect,
  child: SaSelectOption,
}))

export default SaSelect